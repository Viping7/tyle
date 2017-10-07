'use strict';
var itemLength;
var defaultOptions = {
    showProgressBar: true,
    showProgressCount: true,
    onFinish: function () {
        alert('Finished');
    }
};
var width = $(window).width();
$(window).on('resize', function () {
    if ($(this).width() !== width) {
        window.location.reload();
    }
});

// Main function to trigger tyle
$.fn.tyle = function (options) {
    var showProgressBar, showProgressCount, transitionStyle;
    var targetElement = $(this);
    targetElement.before(' <div class="progress-container"></div>');
    if (options) {
        if (options.showProgressBar !== undefined) {
            showProgressBar = options.showProgressBar;
        } else {
            showProgressBar = defaultOptions.showProgressBar;
        }
        if (options.showProgressCount !== undefined) {
            showProgressCount = options.showProgressCount;
        } else {
            showProgressCount = defaultOptions.showProgressCount;
        }
        if (options.onFinish !== undefined && typeof(options.onFinish) === 'function') {
            defaultOptions.onFinish = options.onFinish;
        }
        if (options.duration) {
            targetElement.children().css({
                '-webkit-transition-duration': options.duration / 1000 + 's',
                '-moz-transition-duration': options.duration / 1000 + 's',
                '-mz-transition-duration': options.duration / 1000 + 's',
                'transition-duration': options.duration / 1000 + 's'
            });
        }
        if (options.transition) {
            transitionStyle = options.transition;
        }
        if (options.transition === 'horizontal') {
            $('.item').addClass('inline-item');
            $('.tyle-area').addClass('inline-tyle');
        }

    } else {
        showProgressBar = defaultOptions.showProgressBar;
        showProgressCount = defaultOptions.showProgressCount;
    }
    if (showProgressBar) {
        $('.progress-container').append('<div class="progress-indicator"><span class="progress-bar"></span></div>');
    }
    if (showProgressCount) {
        $('.progress-container').append(' <div class="progress-count"></div>');
    }
    targetElement.after('<div class="step-nav"><button class="form-item-changer nav-btn prev-btn" btn-type="prev" disabled="true">Prev</button><button class="form-item-changer nav-btn next-btn">Next</button></div>');

    itemLength = targetElement.children().length;
    targetElement.children().first().addClass('active');
    progressIndication(0, itemLength);

    $('.form-item-changer').click(function () {
        if (transitionStyle === 'horizontal') {
            $(this).initTyle(targetElement, "width");
        } else {
            $(this).initTyle(targetElement, "height");
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
    if ((itemIndex >= 0 && itemIndex < itemLength - 1) || btnType === 'prev') {
        elementTransitionType(activeItem, itemLength, itemIndex, btnType, transType);
    } else {
        defaultOptions.onFinish(); // On end
    }
};

// To Toggle button state

function disableBtn(btn, flag) {
    $(btn).attr('disabled', flag);
}

// To Indicate step progress

function progressIndication(itemIndex, itemLength) {
    var progressPercent;
    $('.progress-count').html((itemIndex + 1) + ' of ' + itemLength);
    if (itemIndex <= itemLength - 1) {
        progressPercent = (itemIndex + 1) / itemLength * 100;
    }
    $('.progress-bar').css({'width': progressPercent + '%'});
}
// To get the type of transition
function elementTransitionType(activeItem, itemLength, itemIndex, btnType, transType) {
    var transitionAxis, activeItemHeight, nextItemTransitionPos;
    itemIndex = itemIndex + 1;
    if (transType === 'height') {
        activeItemHeight = activeItem.outerHeight();
        transitionAxis = 'Y'; // For selecting translate axis
    } else {
        activeItemHeight = activeItem.outerWidth() + 5;
        transitionAxis = 'X'; // For selecting translate axis
    }
    var currentItemTransitionPos;
    if (btnType === 'prev') {
        progressIndication(itemIndex - 2, itemLength); // Subtracting 2 to get current progress 
        disableBtn('.next-btn', false);
        itemIndex = itemIndex;
        if (itemIndex === 2) {
            nextItemTransitionPos = 0; // To resolve "Infinity" Error
            disableBtn('.prev-btn', true);
        } else {
            nextItemTransitionPos = activeItemHeight * (itemIndex - 2); // To set position of element to inital state
        }
        currentItemTransitionPos = nextItemTransitionPos * 0.5; // Leaving Transition position prev
        transitionStyles(activeItem, activeItem.prev(), currentItemTransitionPos, -nextItemTransitionPos, transitionAxis);
    } else {
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

