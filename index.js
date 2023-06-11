const { Neurosity } = require("@neurosity/sdk");
const player = require('play-sound')(opts = {})
require("dotenv").config();

const deviceId = process.env.DEVICE_ID || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

// 30 second cooldown
const cooldown = 30 * 1000
let lastPlayed = null;

const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
};
verifyEnvs(email, password, deviceId);

console.log(`${email} attempting to authenticate to ${deviceId}`);

const neurosity = new Neurosity({
    deviceId
});

const main = async () => {
    await neurosity
      .login({
        email,
        password
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
    console.log("Logged in");

    neurosity.focus().subscribe((focus) => {
        if (focus.probability < 0.35) {
            if(!lastPlayed || (focus.timestamp - lastPlayed > cooldown)){
                console.log('focus ser.')
                player.play('audio/nani.mp3', function(err){
                    if (err) throw err
                })
                lastPlayed = focus.timestamp;
            }
            
        }
    });

    neurosity.calm().subscribe((calm) => {
        if (calm.probability < 0.2) {
            if(!lastPlayed || (calm.timestamp - lastPlayed > cooldown)){
                console.log('relax ser.')
                player.play('audio/naruto-fight.mp3', function(err){
                    if (err) throw err
                })
                lastPlayed = calm.timestamp;
            }
        }
    });

};
  
main();