# jsonboard
Fancy interface for ML experiments based on JSONL log files.

## Install

```bash
pip install jsonboard
```

## Logging directory

`Jsonboard` expected the logging directory to be structured like the following:

    main_directory
    ├── experiment_name_1
    │   ├── version_0
    │   │   └── data.json
    │   └── version_1
    │       └── data.json 
    ├── experiment_name_1
    │   └── version_0
    │       └── data.json
    └── ...


## Run the server

```bash
jsonboard --path /pth/to/main_directory
```

## Additional parameters

```bash
jsonboard --help
```
