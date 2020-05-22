var inquirer = require("inquirer");

var fs = require("fs");

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
        type: "confirm",
        message: "Would you like to add credits?",
        name: "creditsConfirm"
    },
    {
        type: "confirm",
        message: "Would you like to add credits?",
        name: "creditsConfirm"
    },
    {
        type: "input",
        message: "Can you had your Github username?",
        name: "username"
    },
    {
        type: "input",
        message: "repo url?",
        name: "repo"
    },
])
    .then((response) => {
        console.log(response.title);
        console.log(response.description);
        console.log(response.usage);
        console.log(response.licenceConfirm);
        console.log(response.creditsConfirm);
        console.log(response.username);
        fs.writeFile(`README.md`, `
        
        # ${response.title} \n
        # Description \n
        ${response.description} \n
        # Table of content
        - Installation \n
        - Usage \n
        - Licence \n
        - Contributing \n

        # Installation \n
        ${response.installation}
        `
            , (error) => {
                if (error) {
                    console.log(error);
                }
                console.log("title added");
            })
    });




// github endpoint : https://api.github.com/
// for user : https://api.github.com/users/username
// for repo : https://api.github.com/repos/:owner/:repo/languages
// example: https://api.github.com/users/octocat/hovercard?subject_type=repository&subject_id=1300192