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