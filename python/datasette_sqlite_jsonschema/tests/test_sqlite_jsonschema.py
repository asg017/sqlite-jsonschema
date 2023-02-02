from datasette.app import Datasette
import pytest


@pytest.mark.asyncio
async def test_plugin_is_installed():
    datasette = Datasette(memory=True)
    response = await datasette.client.get("/-/plugins.json")
    assert response.status_code == 200
    installed_plugins = {p["name"] for p in response.json()}
    assert "datasette-sqlite-jsonschema" in installed_plugins

@pytest.mark.asyncio
async def test_sqlite_jsonschema_functions():
    datasette = Datasette(memory=True)
    response = await datasette.client.get("/_memory.json?sql=select+jsonschema_version(),jsonschema()")
    assert response.status_code == 200
    jsonschema_version, jsonschema = response.json()["rows"][0]
    assert jsonschema_version[0] == "v"
    assert len(jsonschema) == 26