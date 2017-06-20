var container = document.getElementsByClassName("container");
for(i = 0; i < container.length; i++) {
    container[i].style.width = "calc(100% - 15px)";
}

var repo = document.getElementsByClassName("repository-with-sidebar");
for(i = 0; i < repo.length; i++) {
    var repoContent = repo.getElementsByClassName("repository-with-sidebar");

    for(i = 0; i < repoContent.length; i++) {
        repoContent[i].style.width = "calc(100% - 45px)";
    }
}
