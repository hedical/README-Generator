const inquirer = require(`inquirer`);

const axios = require("axios")

const fs = require("fs");

const repos = []

inquirer.prompt([
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
    },
    {
        type: "input",
        message: "Can you had your Github username?",
        name: "username"
    },
])
    .then((response) => {
        if (!response.creditsInput) {
            response.creditsInput = "Not credits"
        }
        if (!response.licenceInput) {
            response.licenceInput = "No licence"
        }
        console.log(response.title);
        console.log(response.description);
        console.log(response.usage);
        console.log(response.licenceConfirm);
        console.log(response.licenceInput);
        console.log(response.creditsConfirm);
        console.log(response.creditsInput);
        console.log(response.username);
        fs.writeFile(`README.md`, `# ${response.title}
${response.description}
# Table of content
- Installation
- Usage
- Licence
- Contributing
- Questions

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
                console.log("Your readme has been created");
            })
        axios.get(`https://api.github.com/users/${response.username}`)
            .then(resp => {
                console.log(resp.data.name)
                console.log(resp.data.avatar_url)
                console.log(resp.data.email)
                if (!resp.data.email) {
                    resp.data.email = "Not defined"
                }
                fs.appendFile(`README.md`, `
# Questions
![logo](${resp.data.avatar_url})
- ${resp.data.name}
- Email : ${resp.data.email}`
                    , (error) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log("Your readme has been created");
                    })
            })
            .catch(error => {
                console.log(error);
            });
    });




// github endpoint : https://api.github.com/
// for user : https://api.github.com/users/username
// for repo : https://api.github.com/repos/:owner/:repo/languages
// example: https://api.github.com/users/octocat/hovercard?subject_type=repository&subject_id=1300192