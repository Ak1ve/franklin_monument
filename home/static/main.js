const current_url = window.location.href;

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sendHttpAsync(path, method, body) {
    let props = {
        method: method,
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        mode: "same-origin",
    }

    if (body !== null && body !== undefined) {
        props.body = JSON.stringify(body);
    }

    return fetch(path, props)
        .then(response => {
            return response.json()
                .then(result => {
                    return {
                        ok: response.ok,
                        body: result
                    }
                });
        })
        .then(resultObj => {
            return resultObj;
        })
        .catch(error => {
            throw error;
        }).then(x => {
            if (!x.ok) {
                throw JSON.stringify(x.body);
            }
            return x;
        });
}

function hide(selector) {
    if (typeof selector === "string") {
        $(selector).addClass("hidden").removeClass("transition");
        return;
    }
    selector.addClass("hidden").removeClass("transition");
}

function unhide(selector) {
    if (typeof selector == "string") {
        $(selector).addClass("hidden").addClass("transition");
        return;
    }
    selector.addClass("hidden").addClass("transition");

}

function notify(type, content) {
    let element = $("<div></div>").addClass("alert").addClass(`alert-${type}`);
    element.append('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
    element.append(content);
    $(document).find("nav").after(element);
    return element;
}

function notify_for(type, content, duration) {
    element = notify(type, content);
    setTimeout(function () {
        element.remove();
    }, duration);
}

function dismiss_modal() {
    $('.modal').remove();
    $('.modal-backdrop').remove();
    $('body').removeClass( "modal-open" );
}

function sanitize_link(link) {
    if (typeof link === "undefined") {
        return "";
    }
    let ret = (link.indexOf('://') === -1) ? 'http://' + link : link;
    return ret
}

function set_select(select_query, ids) {
    /*
    Sets <select>s to their given values;
    */
    ids = Array.isArray(ids) ? ids : [ids];
    $(`${select_query} option`).filter(function(i, e) {
        return ids.includes(Number.parseInt($(e).prop("value")));
    }).prop("selected", true).change();
    $(`${select_query}`).selectpicker("refresh");

}