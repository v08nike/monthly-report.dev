const max_visible_value = 20;
// filter by filter datas
function update_data_by_filter(root, map_data, sort_type) {

  let updated_data = map_data

  if (!root.querySelector("[tagId='outperforming']").checked) {
    updated_data = updated_data.filter(
      (item) => item.situation !== 'Outperforming',
    )
  }

  if (!root.querySelector("[tagId='underperforming']").checked) {
    updated_data = updated_data.filter(
      (item) => item.situation !== 'Underperforming',
    )
  }

  if (!root.querySelector("[tagId='tracking']").checked) {
    updated_data = updated_data.filter((item) => item.situation !== 'Tracking')
  }

  // outlook filter
  if (!root.querySelector("[tagId='outperform']").checked) {
    updated_data = updated_data.filter((item) => item.outlook !== 'Outperform')
  }

  if (!root.querySelector("[tagId='underperform']").checked) {
    updated_data = updated_data.filter(
      (item) => item.outlook !== 'Underperform',
    )
  }

  if (!root.querySelector("[tagId='track']").checked) {
    updated_data = updated_data.filter((item) => item.outlook !== 'Track')
  }

  range_min = root.querySelector("[tagId='slider-min']").value
  range_max = root.querySelector("[tagId='slider-max']").value
  updated_data = updated_data.filter(
    (item) => item[sort_type] <= range_max && item[sort_type] >= range_min,
  )

  return updated_data
}

function set_highlight_by_search_result(map_data) {
  updated_data = map_data.map((item) => {
    let place_id = item.place_id.toString();
    if (selected_places.includes(place_id)) {
      return {
        ...item,
        is_selected: true,
        marker: {
          lineColor: colorHighlight,
          lineWidth: 3,
        },
        borderWidth: 3,
        borderColor: colorHighlight,
      }
    }

    return item
  })

  return updated_data
}

function update_and_display_map_data(
  map_chart,
  bar_chart,
  updated_data,
  sort_type,
  map_data,
) {
  map_chart.series[1].update({
    colorKey: sort_type,
    data: transform_map_data(updated_data, sort_type),
  })

  var bar_chart_data = transform_bar_chart_data(updated_data, sort_type)

  let target_index = -1
  let last_selected_item = selected_places[selected_places.length - 1]

  //get index of item selected by user

  for (let i = 0; i < bar_chart_data.length; i++) {
    if (bar_chart_data[i]['place_id'].toString() === last_selected_item) {
      target_index = i
      break
    }
  }

  let from = target_index - (max_visible_value / 2)
  let to = target_index + (max_visible_value / 2)
  if (from < 0) {
    from = 0
    if (bar_chart_data.length < max_visible_value){
      to = bar_chart_data.length-1;
    } else {
      to = 20
    }
  }

  if (to >= bar_chart_data.length - 1) {
    from = bar_chart_data.length - 1 - max_visible_value;
    to = bar_chart_data.length - 1
  }

  if (from < 0){
    from = 0;
  }

  // update bar chart and display it.
  bar_chart.update({
    name: sort_type,
    series: {
      data: bar_chart_data,
    },
    xAxis: {
      min: from,
      max: to,
    },
  })

  bar_chart.xAxis[0].setExtremes(from, to);
  bar_chart.redraw();
}

//update map chart and bar chart depend on filter datas
function update_map_and_chart(root, map_info) {
  let { map_data, map_chart, bar_chart } = map_info

  let sort_type = root.querySelector('.active').getAttribute("tagId") + '_pctl'

  let updated_data = new Array(map_data)
  updated_data = map_data_sort_by(map_data, sort_type);
  //filtering by filter data
  updated_data = update_data_by_filter(root, updated_data, sort_type)
  //set hightlight on data selected by user
  updated_data = set_highlight_by_search_result(updated_data)

  //when this is metro map and chart
  update_and_display_map_data(
    map_chart,
    bar_chart,
    updated_data,
    sort_type,
    map_data
  )
}
