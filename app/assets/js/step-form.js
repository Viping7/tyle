$(window).on('resize',function(){
    window.location.reload();
})
$(document).on('ready',function () {
    itemLength=$('.item').length;
    progressIndication(0,itemLength);
    if($(window).width()<991){
        responsiveForm()
    }
    $('.form-item-changer').click(function () {
        if($(window).width()>991){
        $(this).stepForm();
        }
        else{
            responsiveForm()
        }
    });
})
function responsiveForm(){
    $('.step-container').addClass('owl-carousel owl-theme');
    $('.owl-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:true,
        dots:false,
        autoHeight:true,
        responsive:{
            0:{
                items:1
            },
            1000:{
                items:5
            }
        }
    })
    $('.owl-carousel').on('changed.owl.carousel', function(event) {
      
        progressIndication(event.item.index,itemLength);
    }   ); 
}
$.fn.stepForm=function(){
    var activeItem = $('.item.active');
    var itemIndex = $('.item').index(activeItem);
    var nextItemIndex = $('.item').index(activeItem.next().next())
    var btnType = $(this).attr('btn-type')
    if (itemIndex == 0) {
        disableBtn('.prev-btn', false);
    }
    if (nextItemIndex < 0) {
        disableBtn('.next-btn', true);
    }
    
    if (itemIndex >= 0) {
        elementTransitionType(activeItem,itemLength,itemIndex,btnType);
    }
} 

// To Toggle button state

function progressIndication(itemIndex,itemLength){
    
  //  console.log(itemIndex,$('.item').length)
    if(itemIndex<=itemLength-1){
    progressPercent=(itemIndex+1)/itemLength*100;
    }
  console.log(progressPercent)
    $('.progress-bar').css({'width':progressPercent+'%'});
}
function disableBtn(btn, flag) {
    $(btn).attr('disabled', flag)
}

// To get the type of transition

function elementTransitionType(activeItem,itemLength,itemIndex,type) {
    itemIndex = itemIndex + 1;
    activeItemHeight = activeItem.height();
    var currentItemTransitionPos;
    if (type == 'prev') {
        
        progressIndication(itemIndex-2,itemLength);
        
        disableBtn('.next-btn', false)
        itemIndex = itemIndex;
        if (itemIndex == 2) {
            nextItemTransitionPos = 0;
            disableBtn('.prev-btn', true)
        }
        else{
            nextItemTransitionPos = activeItemHeight * (itemIndex-2); // To set position of element to inital state
        }
        currentItemTransitionPos = nextItemTransitionPos * 0.5; // Leaving Transition position prev
        transitionStyles(activeItem, activeItem.prev(), currentItemTransitionPos, -nextItemTransitionPos);
    }
    else {
        progressIndication(itemIndex,itemLength);
        nextItemTransitionPos = activeItemHeight * itemIndex; 
        currentItemTransitionPos = nextItemTransitionPos *0.7; // Leaving Transition position next
        transitionStyles(activeItem, activeItem.next(), -currentItemTransitionPos, -nextItemTransitionPos);
    }
}

// Transition Styles

function transitionStyles(activeItem, effectingEle, cpos, npos) {
    activeItem.removeClass('active').css({ transform: 'translateY(' + cpos * 1.5 + 'px)' });
    effectingEle.addClass('active').css({ transform: 'translateY(' + npos + 'px)' })
}