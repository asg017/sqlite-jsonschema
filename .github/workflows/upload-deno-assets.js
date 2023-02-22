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
  console.log("release id: ", release.data.id);
  const release_id = release.data.id;

  const compiled_extensions = [
    {
      path: "sqlite-jsonschema-macos-arm/jsonschema0.dylib",
      name: "deno-darwin-aarch64.jsonschema0.dylib",
    },
    {
      path: "sqlite-jsonschema-macos/jsonschema0.dylib",
      name: "deno-darwin-x86_64.jsonschema0.dylib",
    },
    {
      path: "sqlite-jsonschema-ubuntu/jsonschema0.so",
      name: "deno-linux-x86_64.jsonschema0.so",
    },
    {
      path: "sqlite-jsonschema-windows/jsonschema0.dll",
      name: "deno-windows-x86_64.jsonschema0.dll",
    },
  ];
  await Promise.all(
    compiled_extensions.map(async ({ name, path }) => {
      return github.rest.repos.uploadReleaseAsset({
        owner,
        repo,
        release_id,
        name,
        data: await fs.readFile(path),
      });
    })
  );
};
