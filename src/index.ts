import { exec } from "node:child_process";
import { getOptions } from "./utils";

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

checkIfPackagesAreInstalled()


