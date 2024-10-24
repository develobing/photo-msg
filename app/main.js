// Init new camera instance on the player node
const camera = new Camera($('#player')[0]);

// Main app logic
const _init = () => {
  console.log('App initialized');

  // Switch on Camera in viewfinder
  $('#viewfinder').on('show.bs.modal', () => {
    camera.switch_on();
  });

  // Switch off Camera in viewfinder
  $('#viewfinder').on('hidden.bs.modal', () => {
    camera.switch_off();
  });

  // Take photo
  $('#shutter').on('click', () => {
    let photo = camera.take_photo();

    // Show photo preview in camera button
    $('#camera').css('background-image', `url(${photo})`).addClass('withPhoto');
  });

  // Submit message
  $('#send').on('click', () => {
    // Get caption text
    const caption = $('#caption').val();

    // Check if message is ok
    if (!camera.photo || !caption) {
      // Show notification and return
      toastr.warning('Photo & Caption required', 'Incomplete Message');
      return;
    }

    // Render new message in feed
    renderMessage({ photo: camera.photo, caption });

    // Reset caption & photo field on success
    $('#caption').val('');
    $('#camera').css('background-image', '').removeClass('withPhoto');
    camera.photo = null;
  });
};

// Create new message element
const renderMessage = (message) => {
  // Message HTML
  const msgHTML = `
    <div style="display: none" class="row message bg-light mb-2 rounded shadow">
      <div class="col-2 p-1">
        <img src="${message.photo}" class="photo w-100 rounded">
      </div>
      <div class="col-10 p-1">${message.caption}</div>
    </div>
  `;

  // Prepend to #messages
  $(msgHTML)
    .prependTo('#messages')
    .show(500)

    // Bind a click handler on new img element to show in modal
    .find('img')
    .on('click', showPhoto);
};

// Show message photo in modal
const showPhoto = (e) => {
  // Get photo src
  let photoSrc = $(e.currentTarget).attr('src');

  // Set to and show photoframe modal
  $('#photoframe img').attr('src', photoSrc);
  $('#photoframe').modal('show');
};
