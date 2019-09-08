uploadajax_php_filepath = '';
function uploadSuccess(filename) {
	// special for the userfiles uploader (images etc)
	var captainform = false;
    var onWix = false;

	if((typeof window.is_captainform != 'undefined') || (window.location.host.indexOf('app.captainform.com')>-1))
	{
		captainform = true;
	}
    if(typeof we_are_wix != 'undefined')
    {
        onWix = true;
    }
	if ((document.getElementById('thisisiframeuploader') != null) && (selectedform!=null) &&(selectedform!=0))
	{
		if(captainform == true || onWix == true)
		{ 
			window.parent.location.href= window.parent.location;
		}
		else
			window.open('/index.php?p=edit_fields&id='+selectedform, '_top');
	}
	else if (window.isLogoUpload!=undefined && window.isLogoUpload!="")
	{
		if (isLogoUpload == '1')
		{
			top.document.getElementById('logoImageIMG').src = top.document.getElementById('logoImageIMG').src + "?1";
			top.document.getElementById('logoUploadSuccess').innerHTML=filename+" uploaded.";
			top.document.getElementById('logoUploadSuccess').style.display = "";
			document.location = document.location;
		}
	}
    else if (window.isFrontImageUpload!=undefined && window.isFrontImageUpload!="")
    {
        if (isFrontImageUpload == '1')
        {
            top.document.getElementById('FrontImageIMG').src = top.document.getElementById('FrontImageIMG').src + "?1";
            top.document.getElementById('FrontImageUploadSuccess').innerHTML=filename+" uploaded.";
            top.document.getElementById('FrontImageUploadSuccess').style.display = "";
            document.location = document.location;
        }
    }
	if (typeof(interactive123cf_loaded)!="undefined") RefreshFrameHeight(0);
}

function removeUpload(i)
{
    $.ajax({
        url: "/"+uploadajax_php_filepath+"uploadajax.php?action=remove&id=" + i + upload_ajax_extra_url_params(),
        type: 'GET',
        success: function(res) {
            $('#fileattached-' + i).hide();
            $('#fileinput-button-' + i).show();
            $('#newfilesattached-' + i).find('.upload-link').remove();
            if ($('#upload-dropzone-' + i).length > 0) {
                $('#upload-dropzone-' + i).removeClass('hidden');
                $('#fileinput-button-' + i).removeClass('hidden');
				$('#fileinput-button-' + i).parent().find('.fileupload-buttonbar').removeClass('hidden');
				if ($('#newfilesattached-' + i).parent().find('.fileupload-zip-result').length>0) {
	                $('#newfilesattached-' + i).parent().find('.fileupload-zip-result').remove();
				}
            } else {
				$('#newfilesattached-' + i).html('');
			}

        }
    });
}

function click_parent_file(el) {
    var element = $(el);
    element.parent().find('input[type="file"]').trigger("click");
}

function show_collapse_fileupload(el, collapsed_label, expanded_label) {
    var element = $(el);
    if (!element.closest('.fileupload-zip-result').hasClass('fileupload-expanded-result')) {
        element.closest('.fileupload-zip-result').addClass('fileupload-expanded-result');
        element.html(expanded_label);
    } else {
        element.closest('.fileupload-zip-result').removeClass('fileupload-expanded-result');
        element.html(collapsed_label);
    }
}


/**
* [Raul]   Removes the file before of after upload
*
* @param       object  el    Input HTML dom element
*/

function cancel_file_upload(el) {

    if($('#multiple_upload_exist').length && $('.upload-cancel').length < 2) {
        $('#multiple_upload_exist').val('0');
    }

    var container = $(el).closest('tr');

    if (container.find('.fileupload-icon-success').length > 0) {
        var filename = container.find('p.name').first().html();
        var id = container.closest('.fileupload-multiple').find('.uploadid').first().val();
        var sessionid = "";
        if ($('input[name="PHPSESSID"]').length > 0) sessionid = $('input[name="PHPSESSID"]').val();
		var viewformr = '';
		if ( $('#viewformr').length > 0 )
			viewformr = $('#viewformr').val();
		var submissionid = '';
		if ( $('#submissionid').length > 0 )
			submissionid = $('#submissionid').val();

        $.ajax({
            url: "/"+uploadajax_php_filepath+"uploadajax.php",
            data: {
                action: "remove",
                id: id,
                filename: filename,
                PHPSESSID: sessionid,
                multiple_uploads: 1,
				viewformr: viewformr,
				submissionid: submissionid
            },
            success: function(data) {
                if (data == 'Upload Removed') {
					if ($(el).closest('table').find('tr').length == 1) {
						 $(el).closest('.fileupload-multiple').find('.upload-dropzone').removeClass('hidden');
						 $(el).closest('.fileupload-multiple').find('.btn.start').addClass('hidden');
						
					}
					container.remove();
                }
            }
        });
    } else {
        if ($(el).closest('table').find('tr').length == 1) {
       		$(el).closest('.fileupload-multiple').find('.upload-dropzone').removeClass('hidden');
		$(el).closest('.fileupload-multiple').find('.btn.start').addClass('hidden');
	    }
		container.remove();
    }
}


/**
* Generates file icon by given extension
*
* @param       string  filename    Input string
* @return      string
*/

function get_file_icon(filename) {

    if ( filename.length < 5 ) {
		return '';
	}

    if (filename.indexOf('.') === false) {
		return '';
	}

    var filename_arr = filename.split('.');
    var ext = filename_arr[filename_arr.length-1].toLowerCase();

    var file_types = {
        media: {
            default_icon: 'media',
            icons_ext: ['mp3', 'mp4', 'avi', 'flv', 'mov', 'vmw', 'mpeg4', 'wav'],
            other_icons: []
        },
        doc: {
            default_icon: 'doc',
            icons_ext: ['msg', 'odt', 'pdf', 'pps', 'ppsx', 'ppt', 'doc', 'docx', 'pptx', 'rtf', 'text', 'txt', 'xls', 'xlsx'],
            other_icons: []
        },
        design: {
            default_icon: 'design',
            icons_ext: ['psd', 'ai', 'cad'],
            other_icons: []
        },
        compressed: {
            default_icon: 'comp',
            icons_ext: ['rar', 'zip'],
            other_icons: ['7z', 'tar', 'gzip', 'bzip2', 'wim', 'xz']
        },
        code: {
            default_icon: 'code',
            icons_ext: [],
            other_icons: ['c', 'cpp', 'c++', 'pas', 'bas', 'js', 'jar', 'jsp', 'vbproj', 'code', 'php', 'asm', 'html', 'html', 'tpl', 'css', 'htc']
        },
        sys: {
            default_icon: 'sys',
            icons_ext: ['sys'],
            other_icons: ['dll', 'd', 'bat', 'sh', 'cnf', 'cfg']
        }

    };

    if (ext !== '')
	{
        for (type_id in file_types)
		{
            file_settings = file_types[type_id];
            icons_ext = file_settings.icons_ext;
            other_icons = file_settings.other_icons;
            default_icon = file_settings.default_icon;

            if (icons_ext.length > 0)
			{
                for (icon_ext_id in icons_ext)
				{
                    icon_ext = icons_ext[icon_ext_id];
                    if (icon_ext == ext) return icon_ext + '.png';
                }
            }

            if (other_icons.length > 0)
			{
                for (other_icon_id in other_icons)
				{
                    other_icon = other_icons[other_icon_id];
                    if (other_icon == ext) return default_icon + '.png';
                }
            }

        }
    }
    return 'blank.png';
}
/**
 * get extra params that will be send to upload ajax url
 * @return string
 **/
function upload_ajax_extra_url_params()
{
	var toRet = '';
	var viewformr = '';
	if ( $('#viewformr').length )
		viewformr = $('#viewformr').val();
	toRet += '&PHPSESSID=' + sessionid;
	//is there is a submission id set, just added to url
	if ( typeof submissionid != 'undefined' )
		toRet += '&submissionid='+submissionid;
	//is there is a view form R - secter key for form view set, just added to url
	if ( viewformr != '' )
		toRet += '&viewformr='+viewformr;    
	return toRet;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}