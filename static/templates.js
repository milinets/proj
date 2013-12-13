function hereDoc(f) {
  return f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.id] !== undefined) {
            if (!o[this.id].push) {
                o[this.id] = [o[this.id]];
            }
            o[this.id].push(this.value || '');
        } else {
            o[this.id] = this.value || '';
        }
    });
    return o;
};

window.appTemplates = {};
