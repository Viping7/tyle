'use strict';
var itemLength;
var width = $(window).width();
$(window).on('resize', function () {
    if ($(this).width() !== width) {
        window.location.reload();
    }
});

// Main function to trigger tyle
$.fn.tyle = function (animDuration) {
    var targetElement = $(this);
    targetElement.before(' <div class="progress-indicator"><span class="progress-bar"></span></div>');
    targetElement.after('<div class="step-nav"><button class="form-item-changer nav-btn prev-btn" btn-type="prev" disabled="true">Prev</button><button class="form-item-changer nav-btn next-btn">Next</button></div>');
    targetElement.children().css({
        '-webkit-transition-duration': animDuration / 1000 + 's',
        '-moz-transition-duration': animDuration / 1000 + 's',
        '-mz-transition-duration': animDuration / 1000 + 's',
        'transition-duration': animDuration / 1000 + 's'
    });
    itemLength = targetElement.children().length;
    targetElement.children().first().addClass('active');
    progressIndication(0, itemLength);

    $('.form-item-changer').click(function () {
        if ($(window).width() > 991) {
            // For vertical transition in desktop
            $(this).initTyle(targetElement, "height");
        } else {
            // For horizontal transition in mobile and tablet
            $(this).initTyle(targetElement, "width");
        }
    });
};


// Initialize Tyle elements

$.fn.initTyle = function (targetElement, transType) {
    var activeItem = targetElement.children('.active');
    var itemIndex = targetElement.children().index(activeItem);
    var nextItemIndex = targetElement.children().index(activeItem.next().next());
    var btnType = $(this).attr('btn-type');
    if (itemIndex === 0) {
        disableBtn('.prev-btn', false);
    }
    if (nextItemIndex < 0) {
        disableBtn('.next-btn', true);
    }
    if (itemIndex >= 0) {
        elementTransitionType(activeItem, itemLength, itemIndex, btnType, transType);
    }
};

// To Toggle button state

function disableBtn(btn, flag) {
    $(btn).attr('disabled', flag);
};

// To Indicate step progress

function progressIndication(itemIndex, itemLength) {
    var progressPercent;
    if (itemIndex <= itemLength - 1) {
        progressPercent = (itemIndex + 1) / itemLength * 100;
    }
    $('.progress-bar').css({'width': progressPercent + '%'});
}
// To get the type of transition
function elementTransitionType(activeItem, itemLength, itemIndex, btnType, transType){
    var transitionAxis, activeItemHeight, nextItemTransitionPos; 
    itemIndex = itemIndex + 1;
    if (transType === 'height') {
        activeItemHeight = activeItem.height();
        transitionAxis = 'Y'; // For selecting translate axis
    } else {
        activeItemHeight = activeItem.width();
        transitionAxis = 'X'; // For selecting translate axis
    }
    var currentItemTransitionPos;
    if(btnType === 'prev'){
        progressIndication(itemIndex - 2, itemLength); // Subtracting 2 to get current progress 
        disableBtn('.next-btn', false);
        itemIndex = itemIndex;
        if (itemIndex === 2) {
            nextItemTransitionPos = 0; // To resolve "Infinity" Error
            disableBtn('.prev-btn', true)
        }
        else {
            nextItemTransitionPos = activeItemHeight * (itemIndex - 2); // To set position of element to inital state
        }
        currentItemTransitionPos = nextItemTransitionPos * 0.5; // Leaving Transition position prev
        transitionStyles(activeItem, activeItem.prev(), currentItemTransitionPos, -nextItemTransitionPos, transitionAxis);
    }
    else {
        progressIndication(itemIndex, itemLength);
        nextItemTransitionPos = activeItemHeight * itemIndex; // To set the position of next element
        currentItemTransitionPos = nextItemTransitionPos * 0.7; // Leaving Transition position next
        transitionStyles(activeItem, activeItem.next(), -currentItemTransitionPos, -nextItemTransitionPos, transitionAxis);
    }
}

// Transition Styles

function transitionStyles(activeItem, effectingEle, cpos, npos, transitionAxis) {
    activeItem.removeClass('active').css({transform: 'translate' + transitionAxis + '(' + cpos * 1.5 + 'px)'}); //Transition for the current element to exit viewport
    effectingEle.addClass('active').css({transform: 'translate' + transitionAxis + '(' + npos + 'px)'}); //Transition for the next element to enter viewport
}
