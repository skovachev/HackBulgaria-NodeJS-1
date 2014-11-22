# A Big File

We want to use Node streams in order to read a big file, containing random numbers, separated by `,` and compute their sum.

For full task description click [here](Task.md).

## Solution

To create big file use the __file-maker__ module like so:

```
DEBUG=* node file-maker -o outputFileName -s 5GB
```

To read the generate file and calculate the sum use the __big-file-calculator__ module with following command:

```
DEBUG=* node big-file-calculator -i inputFileName
```
