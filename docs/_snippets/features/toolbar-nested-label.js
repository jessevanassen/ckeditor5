/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals ClassicEditor, console, window, document */

import { CS_CONFIG } from '@ckeditor/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';

ClassicEditor
	.create( document.querySelector( '#toolbar-nested-label' ), {
		toolbar: [
			'undo', 'redo', '|',
			{
				label: 'Fonts',
				icon: 'text',
				withText: true,
				items: [ 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor' ]
			},
			'|',
			{
				label: 'Basic styles',
				withText: true,
				items: [ 'bold', 'italic', 'strikethrough', 'superscript', 'subscript' ]
			},
			'|',
			{
				label: 'Inserting',
				withText: true,
				items: [ 'insertImage', 'insertTable' ]
			}
		],
		image: {
			toolbar: [ 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side',
				'|', 'toggleImageCaption', 'imageTextAlternative', '|', 'ckboxImageEdit' ]
		},
		cloudServices: CS_CONFIG,
		ckbox: {
			forceDemoLabel: true
		},
		ui: {
			viewportOffset: {
				top: window.getViewportTopOffsetConfig()
			}
		}
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
