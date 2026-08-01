/**
 * Entry point. Two independent behaviours, no globals, no dependencies.
 *
 * Deliberately a single classic script rather than ES modules: the page has to
 * work when index.html is opened straight off the filesystem, and browsers
 * block module imports over file:// on CORS grounds.
 */
(function () {
  "use strict";

  var THEME_KEY = "cheesecake:theme";
  var CHECKED_KEY = "cheesecake:checked";

  /**
   * localStorage throws in private-mode and file:// edge cases. Every read and
   * write goes through these two so a storage failure never breaks the page.
   */
  function readStore(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Storage unavailable — the page still works, it just will not remember. */
    }
  }

  /* ---------------------------------------------------------------------- */

  function initTheme() {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) {
      return;
    }

    var root = document.documentElement;

    function apply(theme) {
      root.setAttribute("data-theme", theme);
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }

    apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      writeStore(THEME_KEY, next);
    });

    /* Follow the OS only while the visitor has not made a choice of their own. */
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", function (event) {
          if (!readStore(THEME_KEY)) {
            apply(event.matches ? "dark" : "light");
          }
        });
    }
  }

  /* ---------------------------------------------------------------------- */

  function initChecklist() {
    var boxes = Array.prototype.slice.call(
      document.querySelectorAll("[data-checklist] input[type='checkbox']")
    );
    if (!boxes.length) {
      return;
    }

    var resetButton = document.querySelector("[data-checklist-reset]");

    function save() {
      var checked = boxes
        .filter(function (box) {
          return box.checked;
        })
        .map(function (box) {
          return box.id;
        });
      writeStore(CHECKED_KEY, JSON.stringify(checked));
    }

    function syncResetButton() {
      if (!resetButton) {
        return;
      }
      var any = boxes.some(function (box) {
        return box.checked;
      });
      resetButton.disabled = !any;
    }

    /* Restore a list left half-ticked from an earlier session. */
    var stored = readStore(CHECKED_KEY);
    if (stored) {
      try {
        var ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          boxes.forEach(function (box) {
            box.checked = ids.indexOf(box.id) !== -1;
          });
        }
      } catch (error) {
        /* Corrupt value — start from an empty list. */
      }
    }
    syncResetButton();

    /* One delegated listener rather than ten. */
    document.addEventListener("change", function (event) {
      if (
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox" &&
        event.target.closest("[data-checklist]")
      ) {
        save();
        syncResetButton();
      }
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        boxes.forEach(function (box) {
          box.checked = false;
        });
        save();
        syncResetButton();
      });
    }
  }

  /* ---------------------------------------------------------------------- */

  initTheme();
  initChecklist();
})();
