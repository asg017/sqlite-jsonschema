const fs = require("fs").promises;
const crypto = require("crypto");
const archiver = require("archiver");
const stream = require("stream");

function targz(files) {
  return new Promise((resolve, reject) => {
    const output = new stream.PassThrough();
    const archive = archiver("tar", {
      gzip: true,
      gzipOptions: {
        level: 1,
      },
    });

    output.on("close", () => {});

    archive.pipe(output);
    for (const file of files) {
      archive.append(file.data, { name: file.name });
    }

    archive.finalize();

    archive.on("finish", () => {
      resolve(output.read());
    });
  });
}

module.exports = async ({ github, context }) => {
  const {
    repo: { owner, repo },
    sha,
  } = context;
  console.log(process.env.GITHUB_REF);
  const release = await github.rest.repos.getReleaseByTag({
    owner,
    repo,
    tag: process.env.GITHUB_REF.replace("refs/tags/", ""),
  });

  const release_id = release.data.id;

  const compiled_extensions = [
    {
      name: "jsonschema0.so",
      path: "sqlite-jsonschema-ubuntu/jsonschema0.so",
      asset_name: "sqlite-jsonschema-vTODO-ubuntu-x86_64.tar.gz",
    },
    /*{
      name: "jsonschema0.dylib",
      path: "sqlite-jsonschema-macos/jsonschema0.dylib",
    },
    {
      name: "jsonschema0.dylib",
      path: "sqlite-jsonschema-macos-arm/jsonschema0.dylib",
    },
    {
      name: "jsonschema0.dll",
      path: "sqlite-jsonschema-windows/jsonschema0.dll",
    },*/
  ];

  let extension_assets = await Promise.all(
    compiled_extensions.map(async (d) => {
      const extensionContents = await fs.readFile(d.path);
      const ext_sha256 = crypto
        .createHash("sha256")
        .update(extensionContents)
        .digest("hex");
      const tar = await targz([{ name: d.name, data: extensionContents }]);

      const tar_md5 = crypto.createHash("md5").update(tar).digest("base64");
      const tar_sha256 = crypto.createHash("sha256").update(tar).digest("hex");
      return {
        ext_sha256,
        tar_md5,
        tar_sha256,
        tar,
        asset_name: d.asset_name,
      };
    })
  );
  let checksum = {
    extensions: Object.fromEntries(
      extension_assets.map((d) => [
        d.asset_name,
        {
          asset_sha265: d.tar_sha256,
          asset_md5: d.tar_md5,
          extension_sha256: d.ext_sha256,
        },
      ])
    ),
  };

  await github.rest.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id,
    name: "spm.json",
    data: JSON.stringify(checksum),
  });

  await Promise.all(
    extension_assets.map(async (d) => {
      console.log("uploading ", d.asset_name);
      await github.rest.repos.uploadReleaseAsset({
        owner,
        repo,
        release_id,
        name: d.asset_name,
        data: d.tar,
      });
    })
  );
  return;
};
