// 'use strict';
// REQUIRE SECTION
const inquirer = require(`inquirer`);
const axios = require("axios");
const fs = require("fs");
const util = require("util");

// MODULES FOR AUTOCOMPLETE FEATURE
var _ = require('lodash');
var fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

// VARIABLES TO STORE USER REPOSITORY
const repos = [];
let repoUrl = "";
const indexRepo = "";
let userChoices = {};
let badge = "";

// FUNCTION FOR AUTOCOMPLETE FEATURE
function searchRepos(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
        setTimeout(function () {
            var fuzzyResult = fuzzy.filter(input, repos);
            resolve(
                fuzzyResult.map(function (el) {
                    return el.original;
                })
            );
        }, _.random(30, 500));
    });
}

// STARTING PROMPT TO GET USER CHOICES
inquirer.prompt([
    {
        type: "input",
        message: "Can you add your Github username?",
        name: "username"
    },
    {
        type: "input",
        message: "What is the title of your project?",
        name: "title"
    },
    {
        type: "input",
        message: "Can you describe your project?",
        name: "description"
    },
    {
        type: "input",
        message: "Can you provide information on how to install?",
        name: "installation"
    },
    {
        type: "input",
        message: "Explain how we can use your code",
        name: "usage"
    },
    {
        type: "confirm",
        message: "Is your code under a specific licence?",
        name: "licenceConfirm"
    },
    {
        type: "input",
        message: "Please add the licence",
        name: "licenceInput",
        when: (answers) => answers.licenceConfirm === true,
    },
    {
        type: "confirm",
        message: "Would you like to add credits?",
        name: "creditsConfirm"
    },
    {
        type: "input",
        message: "Please add the credits",
        name: "creditsInput",
        when: (answers) => answers.creditsConfirm === true,
    }
])
    .then((response) => {
        // SETTING VALUE IF NO INPUT FROM USER
        !response.creditsInput ? response.creditsInput = "Not credits" : response.creditsInput;
        !response.licenceInput ? response.licenceInput = "No licence" : response.licenceInput;

        userChoices = response
        return response

    })
    // CREATING INITIAL README FILE WITH FIRST SECTIONS
    .then((response) => {
        fs.writeFile(`README.md`, `# ${response.title}
${response.description}
# Table of content
- [Installation](#installation)
- [Usage](#usage)
- [Licence](#licence)
- [Contributing](#contributing)
- [Questions](#questions)

# Installation
    ${response.installation}

# Usage
${response.usage}
# Licence
${response.licenceInput}
# Credits
${response.creditsInput}
    `
            , (error) => {
                if (error) {
                    console.log(error);
                }
            })
        return response.username
    }

    )
    // HTML REQUEST TO GET USER REPOS
    .then((response) => axios
        .get(`https://api.github.com/users/${userChoices.username}`)
        .then((response) => {
            repoUrl = response.data.repos_url
            return repoUrl
        }))
    .then((response) => axios
        .get(response)
        .then((response) => {
            const allRepos = response.data
            allRepos.forEach((element) => {
                repos.push(element.name)
            });
        }
        ))
    .then((response) => {
        // GET USER CHOICE FOR THE TARGETED REPO (USING AUTOCOMPLETE) TO GENERATE THE BADGE
        asyncInq(response)
        // APPENDING THE CONTENT FOR QUESTION SECTION (User info, email and picture)
        asyncAppend()
    }).catch((err) => console.log(err))


// ASYNC PROMPT TO LOAD REPOS FROM USER AND GENERATE BADGE
const asyncInq = async () => {
    try {
        await inquirer.prompt([
            {
                type: 'autocomplete',
                name: 'repositories',
                message: 'Type the name of your repository / Select a repository',
                source: searchRepos,
            }
        ]).then((response) => {
            const userRepo = repos.indexOf(response.repositories)

            axios
                .get(repoUrl)
                .then((response) => {
                    const language = response.data[userRepo].language
                    badge = `https://img.shields.io/badge/-${language}-blue`
                    return badge
                })
                .then(() => {
                    fs.appendFile(`README.md`, `

## Main Language used in this repo              
![badge](${badge})`
                        , (error) => {
                            if (error) {
                                console.log(error);
                            }
                        }
                    )
                })
        })
    } catch (err) {
        console.log(err);
    } console.log("Your readme has been created");
}
const asyncAppend = async () => {
    try {
        await axios
            .get(`https://api.github.com/users/${userChoices.username}`)
            .then(response => {
                !response.data.email ? response.data.email = "Not defined" : response.data.email;
                return response
            })
            .then(response => {
                fs.appendFile(`README.md`, `
# Questions
![logo](${response.data.avatar_url})
- ${response.data.name}
- Email : ${response.data.email}`
                    , (error) => {
                        if (error) {
                            console.log(error);
                        }
                    }
                )
            })
    } catch (err) {
        console.log(err);
    }
}
