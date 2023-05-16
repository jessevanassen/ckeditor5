/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module list/documentlist/documentlistutils
 */
import type { GetCallback } from 'ckeditor5/src/utils';
import { Plugin } from 'ckeditor5/src/core';

import type {	UpcastElementEvent, ViewElement } from 'ckeditor5/src/engine';

export default class DocumentListSeparator extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get pluginName(): 'DocumentListSeparator' {
		return 'DocumentListSeparator';
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		const editor = this.editor;
		const model = editor.model;

		model.schema.register( 'listSeparator', {
			allowWhere: '$block',
			isBlock: true
		} );

		editor.conversion.for( 'upcast' )
			// Add `listSeparator` element between similar list elements on upcast
			.add( dispatcher => {
				dispatcher.on<UpcastElementEvent>( 'element:ol', listSeparatorUpcastConverter() );
				dispatcher.on<UpcastElementEvent>( 'element:ul', listSeparatorUpcastConverter() );
			} )
			// View to model transformation
			.elementToElement( {
				model: 'listSeparator',
				view: 'ck-list-separator'
			} );

		// `listSeparator` should exist in view, but be invisible (hidden)
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'listSeparator',
			view: {
				name: 'div',
				classes: [ 'ck-list-separator', 'ck-hidden' ]
			}
		} );

		// `listSeparator` should not exist in output data
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'listSeparator',
			view: ( modelElement, conversionApi ) => {
				const viewElement = conversionApi.writer.createContainerElement( 'ck-list-separator' );

				conversionApi.writer.setCustomProperty( 'dataPipeline:transparentRendering', true, viewElement );

				viewElement.getFillerOffset = () => null;

				return viewElement;
			}
		} );
	}
}

/**
 * Inserts a `listSeparator` element between two lists of the same type (`ol` + `ol` or `ul` + `ul`).
 */
function listSeparatorUpcastConverter(): GetCallback<UpcastElementEvent> {
	return ( evt, data, conversionApi ) => {
		const element: ViewElement = data.viewItem;
		const nextSibling = element.nextSibling as ViewElement | null;

		if ( !nextSibling ) {
			return;
		}

		if ( element.name !== nextSibling.name ) {
			return;
		}

		if ( !data.modelRange ) {
			Object.assign( data, conversionApi.convertChildren( data.viewItem, data.modelCursor ) );
		}

		const writer = conversionApi.writer;
		const modelElement = writer.createElement( 'listSeparator' );

		// Try to insert `listSeparator` element on the current model cursor position.
		if ( !conversionApi.safeInsert( modelElement, data.modelCursor ) ) {
			return;
		}

		const parts = conversionApi.getSplitParts( modelElement );

		// Extend model range with the range of the created listSeparator element.
		data.modelRange = writer.createRange(
			data.modelRange!.start,
			writer.createPositionAfter( parts[ parts.length - 1 ] )
		);

		conversionApi.updateConversionResult( modelElement, data );
	};
}
