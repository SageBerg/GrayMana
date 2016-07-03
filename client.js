$.get("map.json", handle_map);

function handle_map(res) {
    $("#map").html(res);
}
