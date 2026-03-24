import React, { useEffect, useState } from 'react';
import Select, { components, SingleValueProps, OptionProps } from 'react-select';

type LanguageOption = { label: string; value: string };

const LANGS: LanguageOption[] = [
    { value: 'en', label: '🇬🇧 EN' },
    { value: 'fr', label: '🇫🇷 FR' },
    { value: 'es', label: '🇪🇸 ES' },
    { value: 'de', label: '🇩🇪 DE' },
];

const Option = (props: OptionProps<LanguageOption, false>) => (
    <components.Option {...props}>
        <span className='flex items-center gap-1'>{props.data.label}</span>
    </components.Option>
);

const SingleVal = (props: SingleValueProps<LanguageOption, false>) => (
    <components.SingleValue {...props}>
        <span className='flex items-center gap-1'>{props.data.label}</span>
    </components.SingleValue>
);

const LanguageSwitcher: React.FC = () => {
    const [mounted, setMounted]   = useState(false);
    const [selected, setSelected] = useState<LanguageOption>(LANGS[0]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (opt: LanguageOption | null) => {
        if (!opt) return;
        setSelected(opt);
    };

    if (!mounted) return null;

    return (
        <div style={{ width: 88 }}>
            <Select
                value={selected}
                options={LANGS}
                onChange={handleChange}
                isSearchable={false}
                menuPlacement='top'
                components={{
                    Option,
                    SingleValue: SingleVal,
                    IndicatorSeparator: () => null,
                }}
                styles={{
                    control: (base) => ({
                        ...base,
                        minHeight: 28,
                        height: 28,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderColor: '#d1d5db',
                        cursor: 'pointer',
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 6,
                    }),
                    indicatorsContainer: (base) => ({
                        ...base,
                        height: 24,
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        padding: 2,
                    }),
                    option: (base, state) => ({
                        ...base,
                        paddingTop: 4,
                        paddingBottom: 4,
                        height: 26,
                        fontSize: '0.875rem',
                        backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
                        color: '#111827',
                    }),
                    menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                    }),
                }}
            />
        </div>
    );
};

export default LanguageSwitcher;
