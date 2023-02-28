import { exec } from "node:child_process";
import { exit } from "node:process";
import * as readLine from "node:readline/promises";
import { stdin as input, stdout as output } from 'process'

const checkIfPackagesAreInstalled = () => {
    exec("bluetoothctl --v", (error, stdout, stderr) => {
        console.log(`\t 
                    █▄▄ ▀█▀ █▀▀ █▀█ █▄░█ █▄░█ █▀▀ █▀▀ ▀█▀
                    █▄█ ░█░ █▄▄ █▄█ █░▀█ █░▀█ ██▄ █▄▄ ░█░\n`);
        if (stderr) {
            console.log(`You don't have bluetoothctl installed, Please install it using
                your package manager to continue`);
        } else if (stdout) {
            console.log("~~~ Continuing to check if cut is installed ~~~");
            exec("cut --v", (error, stdout, stderr) => {
                if (stderr) {
                    console.log(`cut is not installed, Please install it 
                        using your package manager to continue`)
                } else if (stdout) {
                    console.log("..... Everything seems to be fine .....");
                    getOptions();
                } else {
                    console.log("Something happened", error);
                }
            })
        } else {
            console.log("There's something wrong, please check logs", error);
        }
    })
}

const getOptions = async () => {
    const rl = readLine.createInterface({ input, output });
    const selectedOption = await rl.question(`You have to following options \n 1. Connect \n 2. Disconnect \n => \t`);
    if(Number(selectedOption) !== 1 && Number(selectedOption) !== 2) {
        console.error(`\t Not a valid option => ${selectedOption}! \n Please choose between \n 1. Connect \n 2. Disconnect, to continue \n => \t`)
    } else if (Number(selectedOption) === 1){
        listBluetoothDevices();
    } else {
        console.log(`Yet to implement ${selectedOption}`);
        exit(0);
    }
}

checkIfPackagesAreInstalled()

function listBluetoothDevices() {
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
        const input = await showOptions(options);
        connectToBt(input, options);
    })

}

type Options = {
    optionId: number | string,
    optionName: string
}

async function showOptions(options: Options[]) {
    const rl = readLine.createInterface({ input, output });
    const option = await rl.question(`\t You have ${options.length} devices to connect to \n ${options.map((opt, index) => `${index}. ${opt.optionName} \n`)}`);
    rl.close();
    return option;
}


function connectToBt(input: string | number, options: Options[]) {
    const choosenOption = options[input];
    console.log(`Connecting to ${choosenOption["optionName"]} 🎧`);
    exec(`bluetoothctl connect ${choosenOption["optionId"]}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        } else if (stderr) {
            console.log(`Stderr: ${stderr}`);
            return;
        } else {
            console.log(`Connected to bluetooth ${choosenOption["optionName"]}`, stdout);
        }
    })
}
