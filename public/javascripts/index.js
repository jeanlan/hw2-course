(function(){

// 插入 <ul> 之 <li> 樣板 // 檢查Chrome元素即可知道樣式
//<li><input type="text"><span></span></li>
var tmpl = '<li><input type="text"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>

// 點擊按鈕時，插入新項目
// 插入 html，isediting變成灰色，focus 正在輸入的狀態
addButton.on('click', function(){
  $(tmpl).prependTo(mainUl).addClass('is-editing').find('input').focus();
});

// 按 Enter 鍵時完成編輯並存檔
// 一個事件發生時會往上擴散 propagation，所以選擇從 ul (mainUl) 開始攔截，而非從 li 開始
mainUl.on('keyup', 'input', function(e){
  // 若目前的鍵是「enter」，把 input 藏起來（從檢查元素找出input 的上一層是li
  if(e.which === 13){
    var input = $(this), li = input.parents('li');

    // 把 <input> 的值複製到 <span> 裡
    li.find('span').text( input.val() );

    // 取消 <li> 的編輯模式（is-editing class）
    li.removeClass('is-editing');

    // 把整個表存進 localStorage
    save();
  }
});

// 從 localStorage 讀出整個表，放進 ul
load();

// 把整個項目表存進 localStorage
//
function save(){
  // 準備好要裝各個項目的空陣列
  arr = [];
  
  // 對於每個 li，
  // 把 <span> 裡的項目（一個物件：{text:文字, isDone:是否被完成}）放進陣列裡
  
//   Tip:
  
//   mainUl.find(li).each(function(){
//      $(this)..find('span').text;
//     if ( $(this))
//      arr.push($(this).text());     
    
//   });
  
  
  // 使用 .each 不用知道string 的長度，他會自己知道傳進去的東西長度有多長，類似特殊的for作用，會自動跑到最後一個
  
  mainUl.find('span').each(function(){
     arr.push($(this).text());     
  });
  // 把陣列轉成 JSON 字串後存進 localStorage
  localStorage.todoItems = JSON.stringify(arr);

}

// 從 localStorage 讀出整個表，放進 <ul>
//
function load(){
  // 從 localStorage 裡讀出陣列 JSON 字串
  if(localStorage.todoItems){
    var arr = JSON.parse(localStorage.todoItems);
    
//     寫法一：jQuery 原生寫法
//     for (i=0; i<arr.length;i++){
//       $(tmpl).appendTo(mainUl).find('span').text(arr[i]);
//     }
//     寫法二：
    arr.forEach(function(item){
     $(tmpl).appendTo(mainUl).find('span').text(item);
    });
    
  }
  // 把 JSON 字串轉回陣列
  // 對於陣列裡的每一個項目，插入回 mainUl 裡。
}

// 課堂練習一
// 讓按鈕可以拖來拖去
$('.connected').sortable({
  //滑鼠指間超過就可以移動交換用 tolerance
  tolerance: "pointer", 
  connectWith: ".connected"
});
  
// 課堂練習二
// 拖曳時顯示隱藏兩個選單
mainUl.on('sortstart',function(){
  console.log('sortstart');
  placeholder.addClass('is-dragging');
}).on('sortstop', function(){
  console.log('sortstop');
  placeholder.removeClass('is-dragging');
});
// 課堂練習三
// 刪除項目
deleteUl.on('sortreceive', function(event, ui){
  ui.item.remove();
  save();
});

// 完成項目 (完成後還是要收回來，且從後面加)
doneUl.on('sortreceive', function(event, ui){
  ui.item.addClass('is-done').appendTo(mainUl);
  save();
});
  
  
}());