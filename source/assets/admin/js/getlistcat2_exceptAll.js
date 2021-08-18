function getJSONCat() {
    var keyCat1 = [],
        keyCat2 = [],
        nameCat1 = [],
        nameCat2 = [];

    $("#processingCat :input").each(function () {
        var input = $(this).val()
        var type = String($(this).attr('id'))

        switch (type) {
            case 'keyCat1':
                //console.log('keyCat1')
                keyCat1.push(input)
                break;

            case 'nameCat1':
                //console.log('nameCat1')
                nameCat1.push(input)
                break;

            case 'keyCat2':
                //console.log('keyCat2')
                keyCat2.push(input)
                break;

            case 'nameCat2':
                //console.log('nameCat2')
                nameCat2.push(input)
                break;
        }
    });
    //console.log(keyCat1, nameCat1, keyCat2, nameCat2)

    var myCat = {}
    var count = 0
    for (i = 0; i < keyCat1.length; i++) {
        var j = i + 1;
        while (j < keyCat1.length && keyCat1[j] === keyCat1[i]) {
            j = j + 1;
        }

        var start = i,
            end = j - 1;
        i = j - 1;

        myCat[String(count)] = {}
        myCat[String(count)]['keyCat1'] = keyCat1[i];
        myCat[String(count)]['nameCat1'] = nameCat1[i];
        myCat[String(count)]['listCat'] = {};

        var countCat2 = 0;
        for (k = start; k <= end; k++) {
            myCat[String(count)]['listCat'][String(countCat2)] = {}
            myCat[String(count)]['listCat'][String(countCat2)]['keyCat2'] = keyCat2[k];
            myCat[String(count)]['listCat'][String(countCat2)]['nameCat2'] = nameCat2[k];
            countCat2++;
        }
        //console.log(keyCat1[start])
        count++;
    }
    $('#processingCat').remove()
    return myCat;
}
const dataCat = getJSONCat();

function getval(sel) {
    var data = dataCat;
    if (sel.value == 'all') {
        $('#cat2').find('option').remove();
        // $('#cat2').append("<option value=\"all\" selected>Tất cả</option>");

        return;
    }
    // const obj = JSON.parse(data);
    Object.entries(data).forEach((entry) => {
        const [key, value] = entry;
        var check = false;
        Object.entries(value).forEach((entry2) => {
            const [key2, value2] = entry2;
            if ((key2 == 'keyCat1') && (value2 == sel.value)) {
                // console.log(`${key2}: ${value2}`);

                check = true;
            }
            if ((key2 == 'listCat') && (check == true)) {
                // console.log(`${key2}: ${value2}`);
                var cat2 = document.getElementById('Cat2');
                $('#cat2').find('option').remove();
                //     .end()
                //     .append('<option value="whatever">text</option>')
                //     .val('whatever')
                // ;
                Object.entries(value2).forEach((entry3) => {
                    const [key3, value3] = entry3;
                    var newoption = '<option value=';
                    Object.entries(value3).forEach((entry4) => {
                        const [key4, value4] = entry4;
                        if (key4 == 'keyCat2') {
                            newoption = newoption + "\"" + value4 + "\"";
                        }
                        if (key4 == 'nameCat2') {
                            newoption = newoption + '>' + value4 + '</option>';
                        }
                        console.log(`${key4}: ${value4}`);
                    });
                    console.log(newoption);
                    // $('#cat2').append(newoption);
                    $('#cat2').append(newoption);
                });
            }
            // console.log(`${key2}: ${value2}`);
        });
        check = false;
        // console.log(`${key}: ${value}`);
    });

    // alert(data['1']['keyCat1']); 

    // alert(sel.value);
}