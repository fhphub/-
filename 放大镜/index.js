// 获取dom
// 原始图片
const originImage = document.getElementById('origin-image'),
    // 左侧图片区域
    origin = document.getElementsByClassName('origin')[0],
    // 放大后的图片
    targetImage = document.getElementById('target-image'),
    // 放大图片区域
    target = document.getElementsByClassName('target')[0],
    // 整个图片区域
    previewContent = document.getElementsByClassName('preview-content')[0],
    // 滑块
    scaleSection = document.getElementsByClassName('scale-section')[0],
    // 文件选择框
    fileInput = document.getElementById('fileInput'),
    // 放大倍数框
    scaleNum = document.getElementById('scaleNum');
// 放大的倍数
let scale = scaleNum.value;
// 左侧图片的宽高
let originWidth, originHeight;

// 注册事件
// 选择文件
fileInput.addEventListener('change', chooseImage, false);
// 改变倍数
scaleNum.addEventListener('change', scaleChange, false);
// 鼠标在左侧区域移动移动
origin.addEventListener('mousemove', (e) => {
    // 事件兼容
    const event = e || window.event;
    // 计算滑块以及右边放大图片的位置
    calculatePosition(event.clientX, event.clientY);
    scaleSection.style.display = 'block';
    target.style.display = 'block';
}, false);
// 鼠标离开左侧图片区域
origin.addEventListener('mouseleave', () => {
    scaleSection.style.display = 'none';
    target.style.display = 'none';
}, false);

// 选择要缩放的图片
function chooseImage(e) {
    // 使用file Reader获取URL
    // 不懂fileReader的可以参考我之前写的本地图片预览
    if (e.target.files[0].type.indexOf('image') === -1) {
        alert('请选择图片');
        return
    }
    const reader = new FileReader();
    reader.onload = () => {
        // promise是为了等图片加载完毕取宽高
        const P1 = () => {
            return new Promise((resolve, reject) => {
                originImage.onload = () => {
                    resolve(originImage);
                };
                originImage.src = reader.result;
            })
        };
        const P2 = () => {
            return new Promise((resolve, reject) => {
                targetImage.onload = () => {
                    resolve(targetImage);
                };
                targetImage.src = reader.result;
            })
        };
        // 获取左侧原图的大小，
        // 初始化放大区域的图片大小
        Promise.all([P1(), P2()]).then((data) => {
            originWidth = data[0].width;
            originHeight = data[0].height;
            data[1].style.width = originWidth * scale + 'px';
            data[1].style.height = originHeight * scale + 'px';
        });
        previewContent.style.display = 'flex';
    };
    reader.readAsDataURL(e.target.files[0]);
}

function calculatePosition(x, y) {
    // 设置边界
    const minTop = 0,
        minLeft = 0,
        maxTop = origin.offsetHeight - scaleSection.offsetHeight,
        maxLeft = origin.offsetWidth - scaleSection.offsetWidth;
    // 计算滑块的位置
    const sectionX = x - origin.offsetLeft - scaleSection.offsetWidth / 2;
    const sectionY = y - origin.offsetTop - scaleSection.offsetHeight / 2;
    // 滑块的真实位置
    // 用于计算右侧放大图片的位置
    let realTop = sectionY,
        realLeft = sectionX;
    // 左右边界
    if (sectionX < minLeft) {
        scaleSection.style.left = minLeft + 'px';
        realLeft = minLeft;
    } else if (sectionX >= maxLeft) {
        scaleSection.style.left = maxLeft + 'px';
        realLeft = maxLeft;
    } else {
        scaleSection.style.left = sectionX + 'px';
    }
    // 上下边界
    if (sectionY <= minTop) {
        scaleSection.style.top = minTop + 'px';
        realTop = minTop;
    } else if (sectionY >= maxTop) {
        scaleSection.style.top = maxTop + 'px';
        realTop = maxTop;
    } else {
        scaleSection.style.top = sectionY + 'px';
    }
    // 计算右侧放大图片的位置
    // 滑块移动多少， 右侧图片就向反方向移动scale的倍数
    targetImage.style.top = -realTop * scale + 'px';
    targetImage.style.left = -realLeft * scale + 'px';
}
// 缩放比例改变
function scaleChange(e) {
    scale = e.target.value;
    targetImage.style.width = originWidth * scale + 'px';
    targetImage.style.height = originHeight * scale + 'px';
    target.style.width = 175 * scale + 'px';
    target.style.height = 175 * scale + 'px';
}