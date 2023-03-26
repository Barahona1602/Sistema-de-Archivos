class Folder {
    constructor(name, parent) {
      this.name = name;
      this.parent = parent;
      this.children = {};
    }
  
    addChild(child) {
      child.parent = this;
      this.children[child.name] = child;
    }
  }
  
  let rootFolder = new Folder("/");
  let parentFolderSelect = document.getElementById("parentFolder");
  
  function displayFolderTree(folder, level) {
    let indent = "";
    for (let i = 0; i < level; i++) {
      indent += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
  
    $("#folderTree").append(indent + "- " + folder.name + "<br>");
  
    for (let childName in folder.children) {
      let child = folder.children[childName];
      displayFolderTree(child, level + 1);
    }
  }
  
  function updateDisplay() {
    $("#folderTree").html("");
    displayFolderTree(rootFolder, 0);
  
    parentFolderSelect.innerHTML = "<option value=''>/</option>";
    addFoldersToSelect(rootFolder);
  }
  
  function addFoldersToSelect(folder) {
    parentFolderSelect.innerHTML += "<option value='" + folder.name + "'>" + folder.name + "</option>";
  
    for (let childName in folder.children) {
      let child = folder.children[childName];
      addFoldersToSelect(child);
    }
  }
  
  function findFolder(name, folder) {
    if (name === "") return rootFolder;
    if (name === folder.name) return folder;
  
    for (let childName in folder.children) {
      let child = folder.children[childName];
      let result = findFolder(name, child);
      if (result !== null) return result;
    }
  
    return null;
  }
  
  function generateDotFile(folder, parent) {
    let dotFile = "";
  
    if (parent !== null) {
      dotFile += '"' + parent.name + '" -> "' + folder.name + '";\n';
    }
  
    for (let childName in folder.children) {
      let child = folder.children[childName];
      dotFile += generateDotFile(child, folder);
    }
  
    return dotFile;
  }
  



