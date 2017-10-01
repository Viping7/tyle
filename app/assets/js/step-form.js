$(window).on('resize', function () {
    window.location.reload();
})

// Main function to trigger tyle
$.fn.tyle = function () {
    var targetElement = $(this);
    itemLength = targetElement.children().length;
    progressIndication(0, itemLength);
    if ($(window).width() < 991) {
        responsiveForm(targetElement)
    }
    $('.form-item-changer').click(function () {
        if ($(window).width() > 991) {
            $(this).initTyle(targetElement);
        }
    });
}

// Function for responsive layout and transition using owl.carousel

function responsiveForm(targetElement, triggerElement) {
    targetElement.addClass('owl-carousel owl-theme');
    $('.owl-carousel .form-item-changer').click(function () {
        $('.owl-carousel').trigger('next.owl.carousel');
    })
    $('.owl-carousel').owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        dots: false,
        autoHeight: true,
        touchDrag: false,
        responsive: {
            0: {
                items: 1
            },
            1000: {
                items: 5
            }
        }
    })
    $('.owl-carousel').on('changed.owl.carousel', function (event) {
        progressIndication(event.item.index, itemLength);
    });
}

// Initialize Tyle elements

$.fn.initTyle = function (targetElement) {
    var activeItem = targetElement.children('.active');
    var itemIndex = targetElement.children().index(activeItem);
    var nextItemIndex = targetElement.children().index(activeItem.next().next())
    var btnType = $(this).attr('btn-type')
    if (itemIndex == 0) {
        disableBtn('.prev-btn', false);
    }
    if (nextItemIndex < 0) {
        disableBtn('.next-btn', true);
    }

    if (itemIndex >= 0) {
        elementTransitionType(activeItem, itemLength, itemIndex, btnType);
    }
}

// To Toggle button state

function disableBtn(btn, flag) {
    $(btn).attr('disabled', flag)
}

// To Indicate step progress

function progressIndication(itemIndex, itemLength) {
    if (itemIndex <= itemLength - 1) {
        progressPercent = (itemIndex + 1) / itemLength * 100;
    }
    $('.progress-bar').css({ 'width': progressPercent + '%' });
}

// To get the type of transition

function elementTransitionType(activeItem, itemLength, itemIndex, type) {
    itemIndex = itemIndex + 1;
    activeItemHeight = activeItem.height();
    var currentItemTransitionPos;
    if (type == 'prev') {

        progressIndication(itemIndex - 2, itemLength); // Subtracting 2 to get current progress 

        disableBtn('.next-btn', false)
        itemIndex = itemIndex;
        if (itemIndex == 2) {
            nextItemTransitionPos = 0; // To resolve "Infinity" Error
            disableBtn('.prev-btn', true)
        }
        else {
            nextItemTransitionPos = activeItemHeight * (itemIndex - 2); // To set position of element to inital state
        }
        currentItemTransitionPos = nextItemTransitionPos * 0.5; // Leaving Transition position prev
        transitionStyles(activeItem, activeItem.prev(), currentItemTransitionPos, -nextItemTransitionPos);
    }
    else {
        progressIndication(itemIndex, itemLength);
        nextItemTransitionPos = activeItemHeight * itemIndex; // To set the position of next element
        currentItemTransitionPos = nextItemTransitionPos * 0.7; // Leaving Transition position next
        transitionStyles(activeItem, activeItem.next(), -currentItemTransitionPos, -nextItemTransitionPos);
    }
}

// Transition Styles

function transitionStyles(activeItem, effectingEle, cpos, npos) {
    activeItem.removeClass('active').css({ transform: 'translateY(' + cpos * 1.5 + 'px)' }); //Transition for the current element to exit viewport
    effectingEle.addClass('active').css({ transform: 'translateY(' + npos + 'px)' }); //Transition for the next element to enter viewport
}