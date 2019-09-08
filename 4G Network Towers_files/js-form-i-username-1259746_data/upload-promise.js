var UploadManager = window.UploadManager || (function ($) {

        function UploadManager() {
        }

        var _promise = null;

        var isUploadCompleted = false;

        var _submitOriginButton = null;

        UploadManager.setSubmitOriginButton= function( button ) {
            _submitOriginButton = button || null;
            _submitOriginButtonParent = button
                ? button.parentNode
                : null;
        };

        UploadManager.getUploadButtons = function () {

            var result = [];

            $('input[type=file][id^=fileupload][multiple]:not([disabled]):not(.no-pointer-events):visible').filter(
                function() {
                    return $(this).closest('.fieldcontainer').hasClass('currentPageActive');
                }
            ).each(
                function () {
                    result.push(this);
                    this.disabled = true;
                }
            );

            return result;
        };

        UploadManager.createButtonPromise = function (fileInputElement) {

            // console.log('create button promise: ', fileInputElement);


            var result = $.Deferred(),
                initialNumberOfErrors;

            //console.log('starting upload ...');

            $(fileInputElement).parent().parent().find('.fileinput-button.start:not([disabled]):not(.no-pointer-events):visible').click();

            function isUploadCompleted() {

                var result = $(fileInputElement).closest('.currentPageActive').fileupload('active');

                return  result == 0;
            }

            function getNumberOfUploadErrors() {
                return $(fileInputElement).parent().parent().find('.upload-container tr span.label.label-danger').length +
                     $(fileInputElement).parent().parent().find('tr.fileupload-upload-error').length;
            }

            initialNumberOfErrors = getNumberOfUploadErrors();

            function onUploadFailed() {
                result.fail( new Error('errors encountered') );

                if ( _submitOriginButton ) {

                    $(_submitOriginButton).show();
                    $(_submitOriginButton).parent().find('.after-click-btn--disable').remove();
                    _submitOriginButton = null;

                }

                $('input[type=file][id^=fileupload][multiple]').each(function () {
                    this.disabled = false;
                });

                // force the upload manager to return another promise.
                setTimeout( function() {

                    _promise = null;

                } , 100 );

            }

            function monitorUpload() {

                if (isUploadCompleted()) {

                    if ( initialNumberOfErrors == getNumberOfUploadErrors() ) {

                        if ( $(fileInputElement).parent().parent().find('tr.template-upload.fade.in').length ) {

                            onUploadFailed();

                        } else {

                            result.resolve(true);

                        }



                    } else {

                        onUploadFailed();

                    }
                    //console.log('upload completed');
                } else {
                    setTimeout(monitorUpload, 100);
                }

            }

            setTimeout(function(){
                if ( isUploadCompleted() ) {
                    result.resolve(true);
                } else {
                    setTimeout(monitorUpload, 100);
                }
            }, 100);

            return result.promise();

        }

        UploadManager.getPromise = function () {

            var result = _promise || ( _promise = (function () {
                    var result = $.Deferred();

                    var uploadButtons = UploadManager.getUploadButtons();

                    if (uploadButtons.length === 0) {

                        result.resolve(true);

                    } else {

                        var promises = [];

                        for (var i = 0, len = uploadButtons.length; i < len; i++) {

                            promises.push(UploadManager.createButtonPromise(uploadButtons[i]));

                        }

                        result = $.when.apply($.when, promises);

                    }

                    return result.promise();

                })() );

            return result.then(function () {

                isUploadCompleted = true;

                // redo submit...
                $('form').submit();

            });
        };

        $(function () {

            var submitCallback = function (e) {

                (function(self){

                    if (isUploadCompleted) {

                        $(self).off('submit', submitCallback );

                        var inputName,
                            inputValue;

                        if ( _submitOriginButton !== null ) {

                            if ( inputName = $(_submitOriginButton).attr('name') ) {

                                var hiddenInput = document.createElement('input');

                                $(hiddenInput).attr('type', 'hidden');
                                $(hiddenInput).attr('name', inputName);

                                inputValue = $(_submitOriginButton).attr('value') || $(_submitOriginButton).attr('src');

                                if ( inputValue !== null ) {
                                    $(hiddenInput).attr('value', inputValue);
                                }

                                self.appendChild(hiddenInput);

                            }

                        }

                        self.submit();

                    } else {

                        UploadManager.getPromise();

                        e.preventDefault();
                        e.stopPropagation();

                    }

                })(this);


            };

            $('form').on('click','input[type=submit],input[type=image],button', function(){
                UploadManager.setSubmitOriginButton(this);
            });

            $('form').on('click','input[type=submit],input[type=image],button', function(){
                UploadManager.setSubmitOriginButton(this);
            });

            $('form').on('submit', submitCallback);
        });

        return UploadManager;

    })(window['$x'] || window['$']);