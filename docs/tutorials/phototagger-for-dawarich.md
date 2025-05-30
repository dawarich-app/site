---
sidebar_position: 11
---

# EXIF Geotag Media Script PowerShell

This PowerShell script is designed to add or update GPS coordinates and location information (country, city, state, country code) to image and MP4 files within a selected folder. It utilizes external APIs (Dawarich and Photon) for geocoding and `exiftool` for writing metadata. The script features a graphical user interface (GUI) for configuration and selecting the folder to process. Progress is displayed in the console.

**Made by:** <a href="https://github.com/adromir" target="_blank">Adromir</a>  
**Source:** <a href="https://github.com/adromir/scripts/tree/main/powershell/exif/geotag" target="_blank">https://github.com/adromir/scripts/tree/main/powershell/exif/geotag</a>

## Key Features

* **Folder-Based Processing:** Selects a folder and processes all supported media files within it.

* **Image Support:** Updates GPS and location data (country, city, state, country code) for common image formats (JPG, PNG, TIFF, HEIC, etc.).

  * Supports reading and converting GPS coordinates from sexagesimal format (degrees, minutes, seconds) to decimal degrees.

  * Uses existing GPS data in the image to bypass the Dawarich API and directly query Photon for location details.

* **MP4 Support:** Updates *only* GPS coordinates (latitude, longitude, altitude) for MP4 files.

  * Country, city, state, or country code are **not** written to MP4 files.

  * Uses existing GPS data in the video to bypass the Dawarich API.

* **Configurable APIs:**

  * **Dawarich API (Primary):** Used to retrieve GPS points based on the file's creation date if no GPS data is present.

  * **Photon API (Secondary):** Used for reverse geocoding (GPS to location details like country, city, state) for images. Can optionally always be queried to overwrite Dawarich location details or supplement missing details.

* **Overwrite:** Option to overwrite existing GPS and location data in files.

* **GUI-Based:**

  * A main window to start processing and access settings.

  * A separate settings window for configuring API URLs, keys, time windows, and the path to `exiftool`.

* **Configuration File:** Settings can be saved and loaded from a `config.json` file in the script directory.

* **Progress and Logging:**

  * Detailed progress display in the PowerShell console using `Write-Progress`.

  * Status messages and warnings are output to the console.

  * Lists of skipped or erroneous files are displayed at the end.

* **🛠️ Exiftool Integration:** Uses the powerful `exiftool.exe` for reading and writing metadata.

##  Requirements

* **PowerShell:** Version 5.1 or higher. (WPF features require a compatible PowerShell version).

* **Windows Operating System:** Due to WPF usage.

* **ExifTool:** The `exiftool.exe` executable must either be:

  * Present in the system PATH.

  * The full path to `exiftool.exe` must be correctly specified in the script settings.

  * You can download ExifTool from the [official ExifTool website](https://exiftool.org/).

* **API Access (optional, but recommended):**

  * An API key and URL for the Dawarich API.

  * The Photon API (defaults to `https://photon.komoot.io`) does not require a key but is important for reverse geocoding. You can setup your own reverse geocoding service, by using the Dockerimage <a href="https://github.com/rtuszik/photon-docker" target="_blank">provided by rtuszik</a>

##  Setup

1.  **Install ExifTool:**
    You have multiple options to install ExifTool:

    ### Method A: Manual Installation (Official Website)
    * **Download:** Go to the [official ExifTool website](https://exiftool.org/).
    * **Find the Executable:** On the downloads page, look for the **Windows Executable** version.
    * **Extract and Rename:** The downloaded zip file will contain `exiftool(-k).exe`. Extract this file and rename it to **`exiftool.exe`**.
    * **Place in PATH:** For the easiest use, move `exiftool.exe` to a folder that is part of your system's PATH, such as `C:\Windows`. Alternatively, you can place it anywhere and specify the full path in the script's settings GUI.

    ### Method B: Install with Winget (Recommended)
    Open a PowerShell or Command Prompt window and run the following command:
    ```sh
    winget install -e --id "ExifTool.ExifTool"
    ```
    Winget will handle the download and installation, automatically adding it to your system's PATH.

    ### Method C: Install with Chocolatey
    If you use the Chocolatey package manager, open an **administrative** PowerShell or Command Prompt and run:
    ```sh
    choco install exiftool
    ```

2. **Configuration File (`config.json`):**

   * On the first run without a `config.json` file in the same directory as the script, default values will be used.

   * You can customize and save settings via the script's GUI. A `config.json` will then be created automatically.

   * The file contains the following settings:

     ```
     {
       "dawarichApiUrl": "YOUR_DAWARICH_API_URL",
       "dawarichApiKey": "YOUR_DAWARICH_API_KEY",
       "photonApiUrl": "[https://photon.komoot.io](https://photon.komoot.io)",
       "defaultTimeWindowSeconds": 60,
       "exiftoolPath": "exiftool.exe", // Or the full path, e.g., "C:\\Path\\To\\exiftool.exe"
       "overwriteExisting": false,
       "alwaysQueryPhoton": false
     }
     
     ```

   * **Important:** Replace `YOUR_DAWARICH_API_URL` and `YOUR_DAWARICH_API_KEY` with your actual API details if you intend to use the Dawarich API.

##  Usage

1. **Starting the Script:**

   * Open a PowerShell console.

   * Navigate to the directory where you saved `geotag_media.ps1`.

   * Execute the script: `.\geotag_media.ps1`

   * **Recommendation:** For the best compatibility with WPF windows, start PowerShell with the `-STA` switch:
     `powershell.exe -STA -File ".\geotag_media.ps1"`

2. **Main Window:**

   * After starting, the main window will appear.

   * **Select Folder & Start Processing:** Click this button to open the folder selection dialog. After selecting a folder, media file processing will begin.

   * **Settings:** Opens the configuration window where you can adjust API details, paths, and behavior options.

   * A notice will be displayed if `config.json` was not found and default settings are being used.

3. **Settings Window:**

   * **Dawarich API URL/Key:** Enter the URL and API key for your primary geocoding API here.

   * **Photon API URL:** The URL for the Photon API (default is `https://photon.komoot.io`).

   * **API Time Window (sec):** The time window (in seconds) before and after a file's creation date used for querying the Dawarich API.

   * **Exiftool Path:** The path to `exiftool.exe`. If `exiftool.exe` is in the system PATH, `exiftool.exe` is sufficient. Otherwise, provide the full path (e.g., `C:\Tools\exiftool.exe`).

   * **Overwrite existing GPS/Location data in files:** If checked, existing GPS and location data in files will be overwritten. Otherwise, only files without this data will be processed.

   * **Always query Photon API:** If checked, Photon will always be queried for images, even if Dawarich provided location data. Photon data will then take precedence for fields it provides. Existing data (from Dawarich or originally in the image) will be preserved for fields for which Photon provides no data.

   * **Save these settings to config.json:** Check this box and click "OK" to save the current settings to the `config.json` file in the script directory.

4. **Processing** and Console **Output:**

   * After selecting a folder and starting processing, progress information will be displayed in the PowerShell console.

   * `Write-Progress` shows an overall progress bar.

   * Detailed status messages for each file and API query are output with timestamps.

   * Warnings (e.g., if an API finds no data) are highlighted in yellow.

   * Errors are highlighted in red.

   * At the end of processing, a summary is displayed, including the number of files scanned, updated, and with errors, as well as lists of skipped files.

   * Processing can be cancelled at any time with **Ctrl+C** in the console.

## 📡 Technical Details

### APIs Used

* **Dawarich API (Example):** Serves as a placeholder for an API that returns GPS points based on a time window (start and end date/time). The script expects a JSON response containing objects with at least `latitude`, `longitude`, `timestamp`, `country`, `city`, and `country_code`.

* **Photon API ([photon.komoot.io](https://photon.komoot.io/)):** An open-source geocoding API based on OpenStreetMap data. It is used for reverse geocoding (converting GPS coordinates to address data). You can run your own Instance

  * The script extracts `country`, `city`, `state` (state/province), and `countrycode`.

### Metadata Tags

**For Images:**
The script writes the following tags using `exiftool`:

* `-GPSLatitude` / `-GPSLatitudeRef`

* `-GPSLongitude` / `-GPSLongitudeRef`

* `-XMP:GPSLatitude` / `-XMP:GPSLongitude` (decimal values)

* `-Country` (Standard EXIF/IPTC)

* `-City` (Standard EXIF/IPTC)

* `-XMP-photoshop:State` (For state/province)

* `-XMP-iptcCore:CountryCode`

**For MP4 Files:**
The script writes the following tags, preferred by Google Photos:

* `-UserData:GPSCoordinates` (Format: `+DD.DDDD, +DDD.DDDD, +ALTITUDEm`)

* `-GPSAltitude` (Set to 0 by default)

* `-GPSAltitudeRef` (Set to 0 = Above Sea Level by default)

* The `-Rotation` information is **not** modified.

### Handling Existing GPS Data

* **Images:**

  1. The script first attempts to read `Composite:GPSLatitude` and `Composite:GPSLongitude` (often provided by exiftool as decimal values).

  2. If unsuccessful, it tries to read the standard EXIF tags `GPSLatitude`, `GPSLongitude`, `GPSLatitudeRef`, `GPSLongitudeRef`.

  3. If these standard tags are in sexagesimal format (e.g., `50 deg 30' 15.12" N`), they are converted to decimal degrees using the `Convert-SexagesimalToDecimal` function.

  4. If valid decimal GPS coordinates can be extracted from the image, the Dawarich API is skipped. The Photon API is then queried with these coordinates for location details (depending on `alwaysQueryPhoton` and the presence of location details).

* **MP4 Files:**

  1. The script attempts to read and parse the `UserData:GPSCoordinates` tag.

  2. If valid GPS coordinates are present, the Dawarich API is skipped.

### Sexagesimal to Decimal Conversion

The `Convert-SexagesimalToDecimal` function parses GPS strings that may contain degrees (`deg` or `°`), minutes (`'`), and seconds (`"`) and converts them to decimal degrees, taking into account the hemisphere (N, S, E, W).

## ⚠️ Important Notes & Troubleshooting

* **ExifTool is essential:** Ensure `exiftool.exe` is correctly configured and accessible to the script.

* **API Keys:** A valid API key is required for the Dawarich API (or your alternative API).

* **Internet Connection:** An active internet connection is needed for API queries.

* **File Permissions:** The script requires write permissions for the media files to update metadata.

* **Large Files:** Processing very large files can take some time, especially reading and writing metadata.

* **Backups:** The script overwrites original files (using the `-overwrite_original` option of exiftool). **It is strongly recommended to create backups of your media files before running the script!**

* **PowerShell Execution Policy:** You may need to adjust the execution policy for PowerShell scripts if you receive an error related to script execution. You can do this with `Set-ExecutionPolicy RemoteSigned` (as administrator). Be aware of the security implications.

* **STA Mode for WPF:** For smooth operation of the WPF windows (Main GUI, Configuration GUI), the script should ideally be started in an STA thread: `powershell.exe -STA -File ".\geotag_media.ps1"`.
