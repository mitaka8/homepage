# Custom Homepage
A custom homepage program which runs on only a single HTML file.

### Features
  - Custom CSS
  - Editable in only JSON
  - RSS Feeds (requires a server)
  - KNM.nl and Buienradar widgets
  - Clock Widget
  - Responsive design

#### Widgets
Currently the following widgets are supported

**clock**
```json
{"type": "widget", "widget": "clock"}
```
**knmi** - Generates a weather chart of The Netherlands (source: knmi.nl)
```json
{"type": "widget", "widget": "knmi"}
```
**buienradar** - Generates a weather chart of The Netherlands (source: buienradar.nl)
```json
{"type": "widget", "widget": "buienradar"}
```
**RSS Feed** - Shows the most recent five items of an RSS feed
```json
{"type": "widget", "widget": "buienradar"}
```
> Note: Yahoo's MediaRSS style are not supported at this time.

Contributions with extra widgets are welcome

