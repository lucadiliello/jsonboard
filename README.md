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

And this is a simple example of how data should be stored:
```js
{
    "hparams": {
        "learning_rate": 1e-05,
        "batch_size": 32,
        "devices": 8,
        "accelerator": "gpu",
        "num_warmup_steps": 10000,
        "max_steps": 100000,
        "alpha": 0.5,
        "train_filepath": "datasets/wikiqa",
    },
    "metadata": {"environment": "google_cloud"},
    "logs": [
        {
            "step": 1000,
            "values": {
                "training/accuracy": 0.9
            }
        },
        {
            "step": 2000,
            "values": {
                "training/accuracy": 0.5
            }
        },
        {
            "step": 3000,
            "values": {
                "training/accuracy": 0.5
            }
        },
        {
            "step": 4000,
            "values": {
                // sometimes values may also be missing
            }
        },
        {
            "step": 5000,
            "values": {
                "training/accuracy": 0.2
            }
        }
    ]
}
```


## Run the server

```bash
jsonboard --path /pth/to/main_directory
```

## Additional parameters

```bash
jsonboard --help
```
