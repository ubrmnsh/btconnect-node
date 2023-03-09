import { exit } from "node:process";
import * as readLine from "node:readline/promises";
import { stdin as input, stdout as output } from 'process'
import { exec } from "node:child_process";

type TOptions = {
    optionId: number | string,
    optionName: string
}

const options: TOptions[] = [{
    optionId: 1,
    optionName: "Connect"
},
{
    optionId: 2,
    optionName: "Disconnect"
},
]



async function readLineInterface(question: string) {
    const rl = readLine.createInterface({ input, output, terminal: false });
    const option = await rl.question(question);
    rl.close();
    return option;
}


export async function getOptions() {
    console.log("\t Choose")
    const inputValue = await readLineInterface(`${options.map(opt => `\t ${opt.optionId}. ${opt.optionName} \n`).join("")}`)
    const selectedOption = options.filter(v => v.optionId === Number(inputValue));
    if (selectedOption.length === 0) {
        console.error('\x1b[33m%s\x1b[0m', `Not a valid option => ${inputValue}`);
        exit(1);
    } else {
        listBluetoothDevices(selectedOption[0]);
    }
}

function listBluetoothDevices(selectedOption: TOptions) {
    exec("bluetoothctl devices | cut -f2- -d ' '", async (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        const options = stdout.split("\n").map(opt => {
            return opt.split(/ (.*)/)
        }).map(v => {
            return {
                optionId: v[0],
                optionName: v[1]
            }
        }).filter(v => v.optionId !== undefined && v.optionName !== undefined);
        //       const input = await showOptions(options, selectedOption.optionName);
        const input = await readLineInterface(`\tYou have ${options.length} devices to ${selectedOption.optionName} to \n\n ${options.map((opt, index) => `\t${index}. ${opt.optionName} \n`).join(" ")}`);
        connectToBt({ input, options, selectedOptionToProceed: selectedOption.optionName });
    })
}

function connectToBt({ input, options, selectedOptionToProceed }: { input: string | number, options: TOptions[], selectedOptionToProceed: string }) {
    const choosenOption = options[input];
    console.log(`${selectedOptionToProceed}ing to ${choosenOption["optionName"]} 🎧`);
    exec(`bluetoothctl ${selectedOptionToProceed.toLowerCase()} ${choosenOption["optionId"]}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`ERROR: Can't connect to ${choosenOption["optionName"]} \n ${error.message}`);
            return;
        } else if (stderr) {
            console.log(`STDERR ${stderr}`);
            return;
        } else {
            console.log(`${selectedOptionToProceed} to bluetooth ${choosenOption["optionName"]}`, stdout);
        }
    })
}
