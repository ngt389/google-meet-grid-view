;(async function () {
  const T = TranslationFactory()

  // Construct HTML
  document.body.classList = 'not-running'
  document.body.innerHTML = `
    <div id="not-running">${T('notRunning')}</div>
    <div id="no-meeting">${T('noMeeting')}</div>
    <label id="enabled">
      <input type="checkbox" class="click"/>
      <span>${T('enabled')}</span>
    </label>

    <label id="show-only-video">
      <input type="checkbox" class="click"/>
      <span class="line">${T('showOnlyVideo')}</span>
	  <hr>
    </label>
    <label id="highlight-speaker">
      <input type="checkbox" class="click"/>
      <span class="line">${T('highlightSpeaker')}</span>
	  <hr>
    </label>
    <label id="include-own-video">
      <input type="checkbox" class="click"/>
      <span class="line">${T('includeOwnVideo')}</span>
	  <hr>
    </label>
    <label id="auto-enable">
      <input type="checkbox" class="click"/>
      <span>${T('autoEnable')}</span>
    </label>

    <label id="screen-capture-mode">
      <input type="checkbox" class="click"/>
      <span>${T('screenCaptureMode')}</span>
      <small>${T('screenCaptureModeDescription')}</small>
    </label>

    <div class="spacer"></div>

    <a id="source-code" href="https://github.com/Fugiman/google-meet-grid-view" target="_blank">
      ${T('sourceCode')}
    </a>
	</br>
	<div id="source-code-logo">
	<a id="Github" href="https://github.com/Fugiman/google-meet-grid-view" target="_blank">
    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Github logo" height="44"  width="auto">
    </a>
	<a id="Google_Meet" href="https://meet.google.com/_meet" target="_blank">
    <img src="https://seeklogo.com/images/G/google-meet-logo-4A92AA9AFE-seeklogo.com.png" alt="Google Meet logo" height="40"  width="auto">
    </a>
	</div>
  `

  // Get state
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const state = await browser.tabs.sendMessage(tabs[0].id, { type: 'getState' })
  if (state.error) return

  if (!state.inMeeting) {
    document.body.classList = 'no-meeting'
    return
  }

  document.body.classList = 'in-meeting'
  document.querySelector('#enabled input').checked = state.enabled
  document.querySelector('#show-only-video input').checked = state.showOnlyVideo
  document.querySelector('#highlight-speaker input').checked = state.highlightSpeaker
  document.querySelector('#include-own-video input').checked = state.includeOwnVideo
  document.querySelector('#auto-enable input').checked = state.autoEnable
  document.querySelector('#screen-capture-mode input').checked = state.screenCaptureMode

  const updateScreenCaptureMode = enabled => {
    document.querySelector('#show-only-video input').checked = !enabled && state.showOnlyVideo
    document.querySelector('#show-only-video input').disabled = enabled
    document.querySelector('#show-only-video').classList.toggle('disabled', enabled)

    document.querySelector('#highlight-speaker input').checked = !enabled && state.highlightSpeaker
    document.querySelector('#highlight-speaker input').disabled = enabled
    document.querySelector('#highlight-speaker').classList.toggle('disabled', enabled)
  }
  const setDisabled = v => {
    document.querySelectorAll('label:not(#enabled)').forEach(el => el.classList.toggle('disabled', v))
    document.querySelectorAll('label:not(#enabled) input').forEach(el => (el.disabled = v))
    if (!v) updateScreenCaptureMode(document.querySelector('#screen-capture-mode input').checked)
  }

  setDisabled(!state.enabled)

  document.querySelectorAll('label').forEach(el => {
    const titleCaseID = el.id
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
    const name = titleCaseID.charAt(0).toLowerCase() + titleCaseID.slice(1)
    const type = 'set' + titleCaseID
    el.querySelector('input').onchange = async e => {
      try {
        const response = await browser.tabs.sendMessage(tabs[0].id, { type, value: e.target.checked })
        if (response.error) throw new Error(response.error)
        state[name] = e.target.checked
        if (name === 'enabled') setDisabled(!e.target.checked)
        if (name === 'screenCaptureMode') updateScreenCaptureMode(e.target.checked)
      } catch {
        e.target.checked = !e.target.checked
      }
    }
  })
})()

  // Disable right button
  var BM = 2; // button middle
  var BR = 3; // button right

  function mouseDown(e) 
  { 
    try { if (event.button==BM||event.button==BR) {return false;} }  
    catch (e) { if (e.which == BR) {return false;} } 
  }
  document.oncontextmenu = function() { return false; }
  document.ondragstart   = function() { return false; }
  document.onmousedown   = mouseDown;
