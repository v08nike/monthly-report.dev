var selected_places = []

function search_input_event_listner(root, map_info, e) {
  e.preventDefault()
  let search_value = e.target.value
  let map_data = map_info.map_data

  root.querySelector('[tagId="suggestions"]').innerHTML =
    '<div id="listbox"></div>'
  if (search_value) {
    let matched_items = get_matched_items(root, search_value, map_data)
    matched_items.forEach((element) => {
      const elementItem = document.createElement('div')
      elementItem.setAttribute('data-id', element.place_id)
      elementItem.setAttribute('class', element.class_name)
      elementItem.innerHTML = element.place_name
      root.querySelector('#listbox').appendChild(elementItem)
      if (element.class_name == 'autocomplete-item') {
        elementItem.addEventListener(
          'click',
          search_result_select_event_listener.bind(this, root, map_info),
        )
      }
    })
  }
}

function get_matched_items(root, search_value, data) {
  let matched_items = []
  let sort_type = root.querySelector('.active').getAttribute('tagId') + '_pctl'
  data.forEach((element) => {
    if (element['place_name'].toLowerCase().includes(search_value.toLowerCase())) {
      let class_name = 'autocomplete-item'
      if (!root.querySelector("[tagId='outperforming']").checked) {
        if ((element['situation'] !== 'Outperforming')) {
          class_name = 'autocomplete-item-disable'
        }
      }

      if (!root.querySelector("[tagId='underperforming']").checked) {
        if ((element['situation'] !== 'Underperforming')) {
          class_name = 'autocomplete-item-disable'
        }
      }

      if (!root.querySelector("[tagId='tracking']").checked) {
        if ((element['situation'] !== 'Tracking')) {
          class_name = 'autocomplete-item-disable'
        }
      }

      // outlook filter
      if (!root.querySelector("[tagId='outperform']").checked) {
        if ((element['outlook'] !== 'Outperform')) {
          class_name = 'autocomplete-item-disable'
        }
      }

      if (!root.querySelector("[tagId='underperform']").checked) {
        if ((element['outlook'] !== 'Underperform')) {
          class_name = 'autocomplete-item-disable'
        }
      }

      if (!root.querySelector("[tagId='track']").checked) {
        if ((element['outlook'] !== 'Track')) {
          class_name = 'autocomplete-item-disable'
        }
      }

      range_min = root.querySelector("[tagId='slider-min']").value
      range_max = root.querySelector("[tagId='slider-max']").value
      if ( !(element[sort_type] <= range_max && element[sort_type] >= range_min)) {
        class_name = 'autocomplete-item-disable'
      }

      matched_items.push({...element, class_name })
    }
  })
  return matched_items
}

function search_result_select_event_listener(root, map_info, e) {
  e.preventDefault()
  root.querySelector("[tagId='hmvi_explorer_input_text'").value = ''
  root.querySelector('#listbox').innerHTML = ''
  let selected_data_id = e.target.getAttribute('data-id')
  if (selected_places.includes(selected_data_id)) {
    return
  }

  selected_places.push(selected_data_id)
  const selectedElement = document.createElement('span')
  selectedElement.setAttribute('data-id', selected_data_id)
  selectedElement.setAttribute('class', 'selected-item')
  selectedElement.innerHTML = '&times; ' + e.srcElement.innerHTML
  selectedElement.addEventListener('click', function (event) {
    event.target.remove()
    // delete item from the selected list
    for (let i = 0; i < selected_places.length; i++) {
      if (selected_places[i] === selected_data_id) {
        selected_places.splice(i, 1)
        update_map_and_chart(root, map_info)
        break
      }
    }
  })

  root
    .querySelector("[tagId='hmvi_explorer_itme_selected']")
    .appendChild(selectedElement)

  update_map_and_chart(root, map_info)
}
