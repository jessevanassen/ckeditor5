/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* bender-tags: treemodel, composer */

'use strict';

import Document from '/ckeditor5/engine/treemodel/document.js';
import Composer from '/ckeditor5/engine/treemodel/composer/composer.js';
import { setData, getData } from '/tests/engine/_utils/model.js';

describe( 'Composer', () => {
	let document, composer;

	beforeEach( () => {
		document = new Document();
		document.createRoot( 'main', '$root' );

		composer = new Composer();
	} );

	describe( 'constructor', () => {
		it( 'attaches deleteContents default listener', () => {
			setData( document, 'main', '<p>f<selection>oo</p><p>ba</selection>r</p>' );

			const batch = document.batch();

			composer.fire( 'deleteContents', { batch, selection: document.selection } );

			expect( getData( document, 'main' ) ).to.equal( '<p>f</p><p>r</p>' );
			expect( batch.deltas ).to.not.be.empty;
		} );

		it( 'attaches deleteContents default listener which passes options', () => {
			setData( document, 'main', '<p>f<selection>oo</p><p>ba</selection>r</p>' );

			const batch = document.batch();

			composer.fire( 'deleteContents', {
				batch,
				selection: document.selection,
				options: { merge: true }
			} );

			expect( getData( document, 'main' ) ).to.equal( '<p>fr</p>' );
		} );

		it( 'attaches modifySelection default listener', () => {
			setData( document, 'main', '<p>foo<selection />bar</p>' );

			composer.fire( 'modifySelection', {
				selection: document.selection,
				options: {
					direction: 'BACKWARD'
				}
			} );

			expect( getData( document, 'main', { selection: true } ) )
				.to.equal( '<p>fo<selection backward>o</selection>bar</p>' );
		} );
	} );

	describe( 'deleteContents', () => {
		it( 'fires deleteContents event', () => {
			const spy = sinon.spy();
			const batch = document.batch();

			composer.on( 'deleteContents', spy );

			composer.deleteContents( batch, document.selection );

			const data = spy.args[ 0 ][ 1 ];

			expect( data.batch ).to.equal( batch );
			expect( data.selection ).to.equal( document.selection );
		} );
	} );

	describe( 'modifySelection', () => {
		it( 'fires deleteContents event', () => {
			const spy = sinon.spy();
			const opts = { direction: 'backward' };

			composer.on( 'modifySelection', spy );

			composer.modifySelection( document.selection, opts );

			const data = spy.args[ 0 ][ 1 ];

			expect( data.selection ).to.equal( document.selection );
			expect( data.options ).to.equal( opts );
		} );
	} );
} );
