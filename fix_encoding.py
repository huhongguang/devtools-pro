import sys

bad = '\ufffd'

files_fixes = {
    'd:/test1/devtools/src/tools/NumberFormat.tsx': [
        # digits普通
        (["'", bad, "', '一', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "']"],
         "'零', '一', '二', '三', '四', '五', '六', '七', '八', '九']"),
        # units普通
        (["'', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '十万', '百万', '千万', '", bad, "']"],
         "'', '十', '百', '千', '万', '十万', '百万', '千万', '亿']"),
        # return zero
        (["return '", bad, "'"], "return '零'"),
        # result += zero
        (["result += '", bad, "'"], "result += '零'"),
        # negative
        (["'", bad, "' : '') + result"], "'负' : '') + result"),
        # capital digits
        (["'", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "']"],
         "'零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']"),
        # capital units
        (["'', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '拾万', '佰万', '仟万', '", bad, "']"],
         "'', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿']"),
        # else zero
        (["'", bad, "'; result"], "'零'; result"),
        # yuan
        (["+ '", bad, "'"], "+ '元'"),
        # jiao
        (["digits[jiao] + '", bad, "'"], "digits[jiao] + '角'"),
        # fen
        (["digits[fen] + '", bad, "'"], "digits[fen] + '分'"),
        # zheng
        (["money += '", bad, "'"], "money += '整'"),
        # label
        (["'Chinese (普", bad, "'"], "'Chinese'"),
        (["'Chinese (大", bad, "'"], "'Chinese Capital'"),
    ],
    'd:/test1/devtools/src/tools/Base64Tool.tsx': [
        (["'Encode ", bad], "'Encode"),
        (["", bad, " Decode'"], " Decode'"),
        (["", bad, "Swap'"], "Swap'"),
        (["mode === 'encode' ? 'Encode ", bad], "mode === 'encode' ? 'Encode"),
        (["'", bad, " Decode'"], "'Decode'"),
        (["", bad, " Swap"], " Swap"),
    ],
    'd:/test1/devtools/src/tools/HtmlEscape.tsx': [
        (["'", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "', '", bad, "'"],
         "'&', '<', '>', '\"', \"'\", '/'"),
        (["'", bad, "': '&amp;'"], "'&': '&amp;'"),
        (["'", bad, "': '&lt;'"], "'<': '&lt;'"),
        (["'", bad, "': '&gt;'"], "'>': '&gt;'"),
        (["'", bad, "': '&quot;'"], "'\"': '&quot;'"),
        (["'", bad, "': '&#x27;'"], "\"'\": '&#x27;'"),
        (["'", bad, "': '&#x2F;'"], "'/': '&#x2F;'"),
        (["c => ENTITIES[c] || c", ], None),  # skip
        (["'Escape ", bad], "'Escape"),
        (["", bad, " Unescape'"], " Unescape'"),
        (["'", bad, "Swap'"], "Swap'"),
        (["mode === 'escape' ? 'Escape ", bad], "mode === 'escape' ? 'Escape"),
    ],
    'd:/test1/devtools/src/tools/UrlEncode.tsx': [
        (["'Encode ", bad], "'Encode"),
        (["", bad, " Decode'"], " Decode'"),
        (["", bad, " Swap"], " Swap"),
        (["mode === 'encode' ? 'Encode ", bad], "mode === 'encode' ? 'Encode"),
    ],
    'd:/test1/devtools/src/tools/JwtDecoder.tsx': [
        (["", bad, " {expiry.msg}"], " {expiry.msg}"),
    ],
}

for filepath, fixes in files_fixes.items():
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_bad = content.count(bad)
        
        for fix in fixes:
            if fix[1] is None:
                continue
            search_parts = fix[0]
            replacement = fix[1]
            search_str = ''.join(search_parts) if isinstance(search_parts, list) else search_parts
            content = content.replace(search_str, replacement)
        
        # Count remaining bad chars
        remaining = content.count(bad)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        fname = filepath.split('/')[-1]
        print(f'{fname}: {original_bad} bad -> {remaining} remaining')
    except Exception as e:
        print(f'ERROR {filepath}: {e}')

print('Done.')
