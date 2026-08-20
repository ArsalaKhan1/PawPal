/*
  Reusable Tabs component.
  It doesn't own any state itself — it's "controlled" from the parent,
  same concept as your controlled <Input> components.

  Props:
  - tabs: array of { key, label }  e.g. [{ key: "vaccinations", label: "Vaccinations" }]
  - activeTab: the currently selected tab's key (owned by parent)
  - onChange: function to call with the new key when a tab is clicked
*/

import Button from "./Button";
function Tabs({ tabs, activeTab, onChange }) {
    return (
            <nav className="healthTabs" aria-label="Health record categories">
            <ul>
                {tabs.map((tab) => (
                    <li key={tab.key}>
                        <Button
                            type="button"
                            onClick={() => onChange(tab.key)}
                            aria-current={activeTab === tab.key ? "page" : undefined}
                        >
                            {tab.label}
                        </Button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Tabs;