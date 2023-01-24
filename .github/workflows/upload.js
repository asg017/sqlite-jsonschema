const fs = require("fs").promises;

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
  async function uploadReleaseAsset(path, name) {
    console.log("Uploading", name, "at", path);

    return github.rest.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id,
      name,
      data: await fs.readFile(path),
    });
  }
  await Promise.all([
    uploadReleaseAsset(
      "sqlite-jsonschema-ubuntu/jsonschema0.so",
      "linux-x86_64-jsonschema0.so"
    ),
    uploadReleaseAsset(
      "sqlite-jsonschema-macos/jsonschema0.dylib",
      "macos-x86_64-jsonschema0.dylib"
    ),
    uploadReleaseAsset(
      "sqlite-jsonschema-macos-arm/jsonschema0.dylib",
      "macos-arm-jsonschema0.dylib"
    ),
    uploadReleaseAsset(
      "sqlite-jsonschema-windows/jsonschema0.dll",
      "windows-x86_64-jsonschema0.dll"
    ),
  ]);

  return;
};
