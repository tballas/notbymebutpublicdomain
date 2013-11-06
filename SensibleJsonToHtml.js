/*
 * Utility to make sensibly pretty-printed and hilighted JSON.
 * Small values are kept inline, larger arrays and objects are broken out onto multiple lines.
 *
 * 2013 Micah Elizabeth Scott. Released into the public domain.
 */

function SensibleJsonToHtml(obj)
{
    var escape = function(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    var visit = function(obj, indentLevel)
    {
        var objString = JSON.stringify(obj);
        var oneLiner = objString.length < 40;
        var items = [];
        var indent = '    ';
        var separator = oneLiner ? ' ' : '\n';
        indentLevel = oneLiner ? '' : (indentLevel || '');
        var nextIndent = oneLiner ? '' : (indentLevel + indent);

        // Simple value?
        if (obj == null || obj == undefined || typeof(obj) != "object") {
            return '<span class="json-' + typeof(obj) + '">' + escape(objString) + '</span>';
        }

        if ($.isArray(obj)) {
            // Array object
            for (var i = 0; i < obj.length; i++) {
                items.push(nextIndent + visit(obj[i], nextIndent));
            }
            return '<span class="json-punctuation">[</span>'
                + separator + items.join(',' + separator)
                + separator + indentLevel + '<span class="json-punctuation">]</span>';

        } else {
            // Dictionary object
            for (var k in obj) {
                items.push(
                    nextIndent + '<span class="json-key">' + escape(JSON.stringify(k)) + '</span>'
                    + '<span class="json-punctuation">:</span> '
                    + visit(obj[k], nextIndent)
                );
            }
            return '<span class="json-punctuation">{</span>'
                + separator + items.join(',' + separator)
                + separator + indentLevel + '<span class="json-punctuation">}</span>';
        }
    }

    return visit(obj);
}
