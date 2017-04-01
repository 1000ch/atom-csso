'use babel';

import { join } from 'path';
import { minify } from '..';

const fixture = join(__dirname, 'fixture.css');

describe('CSSO plugin for Atom', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
  });

  describe('define functions', () => {
    it('have minify()', () => {
      expect(typeof minify).toEqual('function');
    });
  });

  describe('process fixture.css and', () => {
    it('minify', () => {
      waitsForPromise(() => {
        atom.config.set('csso.restructure', false);

        return atom.workspace.open(fixture)
          .then(editor => minify(editor))
          .then(editor => {
            expect(editor.getText()).toEqual('.foo{border-color:red;border-right-color:#00f}');
          });
      });
    });

    it('minify with restructure', () => {
      waitsForPromise(() => {
        atom.config.set('csso.restructure', true);

        return atom.workspace.open(fixture)
          .then(editor => minify(editor))
          .then(editor => {
            expect(editor.getText()).toEqual(`.foo{border-color:red #00f red red}`);
          });
      });
    });
  });
});
