@echo off
rem start-otel-sink - start the telemetry receiver for this project.
rem
rem Double-click it, or let /full-auto-dev start it. The receiver runs in this
rem window; closing the window stops it and the heartbeat stops advancing, which
rem is what makes the gap visible at the next phase boundary.
rem
rem To open it in its own window from a shell:
rem   cmd /c start "" "tools\start-otel-sink.bat"
rem The empty "" is the window title. Drop it and start reads the next word as
rem the program to run, and reports that name as not found.
rem
rem Starting the receiver is only half of the path. Claude Code exports nothing
rem unless .claude/settings.local.json carries the OpenTelemetry env, and it
rem reads env only at startup, so a settings file written mid-session does not
rem take effect until Claude Code is restarted. A receiver whose heartbeat
rem advances while last_event_at stays null means exactly that.
rem
rem Arguments are passed through, so a project on another port starts with
rem   start-otel-sink.bat --port 4319

setlocal
cd /d "%~dp0.."
title otel-sink - %CD%

where node >nul 2>&1
if errorlevel 1 (
  echo start-otel-sink: node was not found on PATH.
  echo Install Node.js 18 or later and run this again.
  echo.
  pause
  exit /b 1
)

node "tools\otel-sink.mjs" %*
if errorlevel 1 (
  echo.
  echo start-otel-sink: the receiver stopped with an error.
  echo A receiver may already be listening on the same port.
  echo.
  pause
)
endlocal
