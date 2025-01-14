/* eslint-disable no-undef */
describe('emojidexPalette:Category', () => {
  beforeAll(done => {
    beforePalette(done)
  })

  afterAll(done => {
    afterPalette(done)
  })

  it('changes to a specific category', done => {
    $('#tab-content-faces').watch({
      id: 'content_faces',
      properties: 'prop_innerHTML',
      watchChildren: true,
      callback(data) {
        if (data.vals[0].match(/category-emoji-list/)) {
          expect($('#tab-faces')).toHaveClass('active')
          expect($('#tab-content-faces')).toHaveClass('active')
          expect($('#tab-content-faces').find('img').length).toBeTruthy()
          removeWatch($('#tab-content-faces'), 'content_faces')
          done()
        }
      }
    })

    showPalette(() => {
      $('#tab-faces a').click()
    })
  })

  it('switches to the next page', done => {
    $('#tab-content-faces').watch({
      id: 'content_faces',
      properties: 'prop_innerHTML',
      watchChildren: true,
      callback(data) {
        expect($(data.vals[0]).find('ul.pagination li.disabled span').text().substr(0, 1)).toBe('2')
        removeWatch($('#tab-content-faces'), 'content_faces')
        done()
      }
    })
    $('#tab-content-faces').find('.pagination .palette-pager')[1].click()
  })

  it('switches to the previous page', done => {
    $('#tab-content-faces').watch({
      id: 'content_faces',
      properties: 'prop_innerHTML',
      watchChildren: true,
      callback(data) {
        expect($(data.vals[0]).find('ul.pagination li.palette-num span').text().substr(0, 1)).toBe('1')
        removeWatch($('#tab-content-faces'), 'content_faces')
        done()
      }
    })
    $('#tab-content-faces').find('.pagination .palette-pager')[0].click()
  })
})
/* eslint-enable no-undef */
