# jsonboard
Fancy interface for ML experiments based on JSON/JSONL log files.

## Install

```bash
pip install jsonboard
```

## Logging directory

`JsonBoard` expects the logging directory to be structured like the following:

    main_directory
    ├── experiment_name_1
    │   ├── version_0
    │   │   ├── hparams.json
    │   │   ├── meta.json
    │   │   └── data.jsonl
    │   └── version_1
    │       ├── hparams.json
    │       └── data.jsonl
    ├── experiment_name_1
    │   └── version_0
    │       └── data.jsonl
    └── ...

`data.jsonl` is not just a JSON to enable easy appending of new results.


### Examples

Follow a few log files to take as example.

#### `hparams.json`

```js
{

    "learning_rate": 1e-05,
    "batch_size": 32,
    "devices": 8,
    "accelerator": "gpu",
    "num_warmup_steps": 10000,
    "max_steps": 100000,
    "alpha": 0.5,
    "train_filepath": "datasets/wikiqa"
}
```

#### `meta.json`

```js
{
    "environment": "google_cloud"
}
```

#### `data.jsonl`

Some field may even be `null`, the corresponding points will not be plotted.

```js
{ "step": 1000, "training/accuracy": 0.9 }
{ "step": 2000, "training/accuracy": 0.7 }
{ "step": 3000, "training/accuracy": 0.6 }
{ "step": 4000, "training/accuracy": 0.4 }
{ "step": 5000, "training/accuracy": 0.3 }
{ "step": 6000, "training/accuracy": 0.1 }
{ "step": 7000, "training/accuracy": null }
{ "step": 7000 }
```

An example of loggings directory is `examples/`.


## Run the server

Start the server with:
```bash
jsonboard --input /path/to/logging/dir
```

or just try our framework by running the following (you must download the `examples/` folder):

```bash
jsonboard --input examples/
```


## Additional parameters

List additional CLI parameters with:
```bash
jsonboard --help
```
