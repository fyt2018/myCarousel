var config = {
    imgArr: ['./assets/img/1.jpg', './assets/img/2.jpg', './assets/img/3.jpg'],
    imgWidth: 520,
    doms: {
        imgBox: document.querySelector('.imgBox'),
        dots: document.querySelector('.dots'),
        left: document.querySelector('.left'),
        right: document.querySelector('.right'),
    },
    timer: {
        duration: 16,
        total: 300,
        id: null
    },
    imgNum:0,
    currentIndex: 0,
    marginLeft:0,
    autoTimer:null
}
config.doms.left.onclick = toLeft;
config.doms.right.onclick = toRight

function toLeft() {
      let index = config.currentIndex - 1 ;
      if(index < 0){
          index = config.imgNum - 1
      }
      switchTo(index,'right')
}
function toRight(){
        let index = (config.currentIndex + 1 ) % config.imgNum;
        console.log(index)
        switchTo(index,'left')
}

config.doms.dots.onclick = function (e) {
        if(e.target.tagName == 'SPAN'){
            let index = Array.from(config.doms.dots.children).indexOf(e.target);
            switchTo(index,index > config.currentIndex ? 'left' : 'right')
            console.log(index)
        }
}
config.doms.imgBox.onmouseenter = function(){
     clearInterval(config.autoTimer);
    config.autoTimer = null
}
config.doms.imgBox.onmouseleave= function(){
    config.autoTimer = setInterval( ()=>{
        toRight()
    } ,2000)
}

config.autoTimer = setInterval( ()=>{
    toRight()
} ,2000)

function init() {
    initSize();
    initDots();
    initElement();
    initPosition()
    console.log(config)
}

/**
 * 初始化imgBox
 */
function initSize() {
    config.imgArr.forEach((item, index) => {
        let img = new Image();
        img.src = item;
        img.className = 'img';
        let span = document.createElement('span');
        span.dataset = index;
        config.doms.imgBox.appendChild(img);
        config.doms.dots.appendChild(span);
    })

    config.imgNum = config.imgArr.length;
}

/**
 * 增加用来过度的img
 */
function initElement(){
     let img__first = new Image(),img__end = new Image(),start = config.doms.imgBox.children[0];
     img__first.src = config.imgArr[config.imgNum - 1],img__end.src = config.imgArr[0];
     img__first.className = ' img';img__end.className = ' img';
     config.doms.imgBox.appendChild( img__end );
     config.doms.imgBox.insertBefore( img__first,start );
     config.doms.imgBox.style.width = (config.imgArr.length + 2 ) * config.imgWidth + 'px'
}

/**
 * 初始化dots 样式
 */
function initDots(){
     for(var i = 0; i < config.imgNum ; i++){
           let span = config.doms.dots.children[i];
           if( i == config.currentIndex){
                span.className = 'active'
           }
           else
           {
               span.className = ''
           }
     }
}

/**
 *
 */
function initPosition(){
    config.doms.imgBox.style.left =   (-config.currentIndex - 1) * config.imgWidth + 'px';
    config.marginLeft =  (-config.currentIndex - 1) * config.imgWidth;
}

/**
 *
 */
function switchTo(index,direction = 'right'){
     if(index == config.currentIndex)return
     animation();
     config.currentIndex = index;
     initDots();


    // 逐步变到最终的left
    function animation(){
        stopAnimation();
        // 要移动的次数
        let number = Math.ceil(config.timer.total / config.timer.duration);
        //console.log('要移动的次数',number)
        //当前的left
        let marignLeft =  parseFloat(getComputedStyle(config.doms.imgBox).left) ;
        //console.log('当前的left',marignLeft)
        // 最终的left
        let newLeft = (-index - 1) * config.imgWidth;
        //console.log('最终的left',newLeft)
        // 要移动的距离
        let distance = initDistance(newLeft,marignLeft);
        //console.log('要移动的距离',distance)
        //每次要移动的距离
        let disX = distance / number;
        //console.log('每次要移动的距离',disX)

        //当前运动的次数
        let currentNum = 0;
        config.timer.id = setInterval(()=>{
            if(direction == 'left' && Math.abs(marignLeft)  >  config.imgWidth*config.imgNum ){
                marignLeft += config.imgWidth*config.imgNum;
            }else if(direction == 'right' && Math.abs(marignLeft) <  config.imgWidth){
                marignLeft -=  config.imgWidth*config.imgNum;
            }
            marignLeft += disX
            config.doms.imgBox.style.left =  marignLeft + 'px'
            currentNum++
            if(currentNum == number){stopAnimation()}

        },config.timer.duration)
    };
    function stopAnimation(){
          clearInterval(config.timer.id );
          config.timer.id = null
    };
    function initDistance(newLeft,marignLeft){
        let total = config.imgWidth * config.imgNum;
            if(direction == 'left'){
                if(newLeft < marignLeft ){
                     return (newLeft - marignLeft)
                }else{

                    return (- (total - Math.abs(newLeft - marignLeft)))
                }
            }
            else if(direction == 'right'){
                if( newLeft > marignLeft){
                    return (newLeft - marignLeft)
                }else{
                    return (total - Math.abs(newLeft - marignLeft))
                }
            }
    }
}
init()
