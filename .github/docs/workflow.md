# Workflow

## branch name generating - shortcuts story

### Preface

In this project we'll only work with branch names which will be generated from <br/>
[shortcuts](https://shortcut.com/) stories - shortcut story = branch. <br/>

> **Please note**: any commit that will be committed without the workflow won't be accepted!

### Generating branch name

In order to generate a branch name we'll use the following steps:

1. **First** you'll need an invitation in order to permissions to the shortcut workspace.


2. Go to our shortcuts workspace using [this link](https://app.shortcut.com/anki/stories/)


3. Open the relevant story , example for a story:<br/>
   <img src="..\assets\storyExample.png" alt="story-example"/>


4. **Click** on the **git helper** icon **in the upper right corner**, reference the image below:<br/>
   <img src="..\assets\gitHelperIcon.png">


5. the dialog in image below will be opened:<br/>
   <img src="..\assets/gitHelperDialog.png">


6. You'll want to **copy the 2nd text field** content and **paste** it **into** your **CLI**: <br/>
   <img src="..\assets\gitHelperDialogCopy.png">
   <img src="..\assets\cliExample.png">


7. start coding! :)

## Commit

> **Please note**: any commit that won't be committed through commitizen won't be accepted!

stage the changes you want to commit:

```shell
 git add <what you want to be staged to commit> || . (if you want to stage all files) 
```

run commit pipeline using commitizen:

```shell
 npm run commit -> will run commitizen in the cli with a pipline for commiting.
```

for first commit in the branch:

```shell
 git push --set-upstream origin <branch name> 
```

otherwise:

```shell
 git push
```

Good job! you have pushed your branch to the remote!
