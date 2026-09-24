# SmartThings laundry card

Lovelace card for the Samsung washer and dryer (`DA_WM_TP2_20_COMMON`) exposed by the Home Assistant SmartThings integration. The dashboard shows a tile. A tap opens a more-info style dialog with the essential controls:

- remaining time, end time and cycle phases
- start, pause, resume and stop
- cycle selection
- the options of the selected cycle: temperature, spin, rinses, dry level, drying time, delay end, Bubble Soak, wrinkle prevent, Auto Cycle Link, dispense amounts
- detergent and softener levels

The card finds the entities of the device by `translation_key`, so it does not depend on entity IDs. It needs the SmartThings integration with the washer and dryer entities (cycle selects, delay end, dispense amounts). The accent color is the theme `--primary-color`.

## Install

1. Copy `smartthings-laundry-card.js` to `/config/www/smartthings-laundry-card/`.
2. Add a dashboard resource: URL `/local/smartthings-laundry-card/smartthings-laundry-card.js?v=<n>`, type JavaScript module. Increase `v` after each update to bypass the frontend cache.

## Configuration

```yaml
type: custom:smartthings-laundry-card
device_id: <device id of the washer or dryer>
name: Lavatrice # optional
```

`entity: <any entity of the appliance>` can replace `device_id`.

## Development

`dev/harness.html` renders the card with a mocked `hass` object:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/dev/harness.html
```

## License

GNU Lesser General Public License v3.0 or later. See `COPYING.LESSER` and `COPYING`.
