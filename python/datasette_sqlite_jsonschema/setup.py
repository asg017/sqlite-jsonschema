from setuptools import setup

VERSION = "0.1.1-alpha.3"

setup(
    name="datasette-sqlite-jsonschema",
    description="",
    long_description="",
    long_description_content_type="text/markdown",
    author="Alex Garcia",
    url="https://github.com/asg017/sqlite-jsonschema",
    project_urls={
        "Issues": "https://github.com/asg017/sqlite-jsonschema/issues",
        "CI": "https://github.com/asg017/sqlite-jsonschema/actions",
        "Changelog": "https://github.com/asg017/sqlite-jsonschema/releases",
    },
    license="MIT License, Apache License, Version 2.0",
    version=VERSION,
    packages=["datasette_sqlite_jsonschema"],
    entry_points={"datasette": ["sqlite_jsonschema = datasette_sqlite_jsonschema"]},
    install_requires=["datasette", "sqlite-jsonschema"],
    extras_require={"test": ["pytest"]},
    python_requires=">=3.7",
)