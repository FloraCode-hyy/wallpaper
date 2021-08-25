//大页面
let mains = document.querySelectorAll('.main')
const home = document.querySelector('.home');
let mine = document.querySelector('.mine');
let hot = document.querySelector('.hot');
let newc = document.querySelector('.New');
let details = document.querySelector('.details')
let searchPic = document.querySelector('.search')
//侧边栏样式变化
let navigation = document.querySelector('.navigation')
let search = document.querySelector('#search')
let backBtn = document.querySelector('#back')
let title = document.querySelector('#searchTitle')
let searchBtn = document.querySelector('#searchBtn')
//导航栏样式变化
//let headBtns = home.querySelector('.header').querySelectorAll('a')

let content = home.querySelector('.content')
let allContents = document.querySelectorAll('.content')
let mineContent = document.querySelector('.mineContent')
let searchContent = searchPic.querySelector('.content')
//实现收藏功能
let star = document.querySelector('#star')
let box = document.querySelector('.picbox')
let imgBig = box.querySelector('img')

let lastBlock = null;
let currentBlock = home;
let starsUrl = [];
let menuflag = true;
let flag;

//JS调用c#
let wallBtn = document.querySelector("#wall")

wallBtn.onclick = function () {
    let url = imgBig.src
    window.nativeObject.nativeMethodAsync(url);
}

searchBtn.onclick = function() {
    selectedMain(searchPic)
    let searchData = window.nativeObject.searchPictureAsync(title.value)
    appendImgFromSearch(searchData)
    //appendImgFromSearch(results)
}

title.onkeypress = function (event) {
    if(event.which === 13) {
        selectedMain(searchPic)
        let searchData = window.nativeObject.searchPictureAsync(title.value)
        appendImgFromSearch(searchData)
    }
}
//网页加载初始化
function init() {
    //BtnsActive(home);
    //BtnsActive(mine);
    //appendImgFromWeb(results);
    const result = localStorage.getItem("favourite")
    if(result != null) {
        starsUrl = JSON.parse(result);
    }else{
        flag = false;
    }
}
init();

//实现给页面动态添加图片
function appendImgFromWeb(data){
    let urls = [];
    aaa = JSON.parse(data)
    for(let i = 0; i <aaa.photos.results.length;i++){
    urls.push(aaa.photos.results[i].urls.regular)
    }
    content.innerHTML='<ul></ul>'
    appendImg(content,urls)
}

function appendImgFromSearch(data){
    let urls = [];
    bbb = JSON.parse(data)
    for(let i = 0; i <bbb.photos.results.length;i++){
    urls.push(bbb.photos.results[i].urls.regular)
    }
    searchContent.innerHTML='<ul></ul>';
    appendImg(searchContent,urls)
}

//插入图片
function appendImg(content,url){
    let ul = content.querySelector('ul')
    for(let i = 0; i< url.length; i++){
        var li = document.createElement('li')
        ul.appendChild(li)
        var a = document.createElement('a')
        a.href = '#'
        li.appendChild(a)
        var img = document.createElement('img')
        img.src = url[i]
        img.onclick = function () {
            selectedMain(details)
            backBtn.style.display = 'block'
            src = this.getAttribute('src')
            imgBig.setAttribute('src', src)
            IsImgStar(src);
        }
        a.appendChild(img)
    }
}

//主页面事件
//实现点击查看大图 
for (let i = 0; i< allContents.length;i++){
    let imgs = allContents[i].querySelectorAll('img')
    imgDetails(imgs)
}

function imgDetails(imgs){
    for(let j = 0; j < imgs.length; j++){
        imgs[j].onclick = function () {
            selectedMain(details)
            backBtn.style.display = 'block'
            src = this.getAttribute('src')
            imgBig.setAttribute('src',src)
            IsImgStar(src);
        }
    }
}

//判断当前图片是否在收藏里面
function IsImgStar(src) {
    if(starsUrl.includes(src)){
        star.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>'
        flag = true;
    }else{
        star.innerHTML = '<i class="fa fa-star-o" aria-hidden="true"></i>'
        flag = false;
    }
}

// 点击收藏功能
function starClick() {
    let url = imgBig.src;
    if(!flag){
        star.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>'
        starsUrl.push(url)
        localStorage.setItem("favourite", JSON.stringify(starsUrl))
    }else{
        star.innerHTML = '<i class="fa fa-star-o" aria-hidden="true"></i>'
        ImgRemoveStar(url);
    }
    flag = !flag;
}

//将图片移除收藏夹
function ImgRemoveStar (url){
    if(starsUrl.includes(url)){
        let index = starsUrl.indexOf(url)
        starsUrl.splice(index,1)
        localStorage.setItem("favourite", JSON.stringify(starsUrl))
    }else{
        return;
    }
}



//侧边栏事件
//实现侧边栏伸缩变化
function openMenu() {
    navigation.classList.toggle('active');
    for(let i = 0; i< mains.length; i++){
        if(menuflag) {
            mains[i].style.left = '400px';
        }else {
            mains[i].style.left = '60px';
        }
    }
    title.focus()
    search.classList.toggle('searchActive')
    menuflag = !menuflag
    // setMainWidth(flag)
}
title.onfocus = function(){
    title.value = '';
}

function openHome() {
    for (let i = 0; i < mains.length; i++) {
        mains[i].style.display = 'none'
    }
    home.style.display = 'block'
}

//实现切换主页面
function selectedMain(block) {
    for(let i = 0; i<mains.length; i++) {
        mains[i].style.display = 'none'
    }
    block.style.display = 'block';
    lastBlock = currentBlock;
    currentBlock = block;
}

function back() {
    selectedMain(lastBlock);
    backBtn.style.display = 'none'
}
// 点击mine图标时，清空所有内容，并加载starUrl
function openMine () {
    selectedMain(mine);
    mineContent.innerHTML='<ul></ul>';
    appendImg(mineContent,starsUrl);
    let imgs = mineContent.querySelectorAll('img')
    imgDetails(imgs)

}

//导航栏事件
//导航栏点击变化样式
function BtnsActive(block) {
    let header = block.querySelector('.header')
    let Btns = header.querySelectorAll('a')
    for(let i = 0 ; i < Btns.length;i++){
        Btns[i].onclick = function() {
            for(let i = 0; i < Btns.length; i++) {
                Btns[i].className = '';
            }
            Btns[i].classList.toggle('active')
        }
    }
}