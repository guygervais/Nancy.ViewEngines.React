﻿namespace Nancy.ViewEngines.React
{
    using System.Configuration;

    internal class ReactConfiguration : ConfigurationSection
    {
        static ReactConfiguration()
        {
            Instance =
                ConfigurationManager.GetSection("reactViewEngine") as ReactConfiguration ??
                new ReactConfiguration();
        }

        internal static ReactConfiguration Instance { get; }

        [ConfigurationProperty("xmlns")]
        internal string XmlNamespace =>
            this["xmlns"] as string;

        [ConfigurationProperty("script")]
        internal ScriptElement Script =>
            this["script"] as ScriptElement;

        [ConfigurationProperty("server")]
        internal ServerElement Server =>
            this["server"] as ServerElement;

        internal class ScriptElement : ConfigurationElement
        {
            [ConfigurationProperty("dir", DefaultValue = "client")]
            internal string Dir =>
                this["dir"] as string;

            [ConfigurationProperty("name", DefaultValue = "script.js")]
            internal string Name =>
                this["name"] as string;

            [ConfigurationProperty("extensions")]
            internal ExtensionCollection Extensions =>
                this["extensions"] as ExtensionCollection;

            [ConfigurationProperty("layout")]
            internal LayoutElement Layout =>
                this["layout"] as LayoutElement;
        }

        internal class ServerElement : ConfigurationElement
        {
            [ConfigurationProperty("assets")]
            internal AssetsElement Assets =>
                this["assets"] as AssetsElement;
        }

        internal class ExtensionElement : ConfigurationElement
        {
            private readonly string name;

            static ExtensionElement()
            {
                DefaultValue = new ExtensionElement("jsx");
            }

            internal ExtensionElement()
            {
            }

            private ExtensionElement(string name)
            {
                this.name = name;
            }

            internal static ExtensionElement DefaultValue { get; }

            [ConfigurationProperty("name", IsRequired = true)]
            internal string Name =>
                this.name ?? this["name"] as string;
        }

        internal class ExtensionCollection : ConfigurationElementCollection
        {
            protected override ConfigurationElement CreateNewElement() =>
                new ExtensionElement();

            protected override object GetElementKey(ConfigurationElement element) =>
                (element as ExtensionElement)?.Name;
        }

        internal class LayoutElement : ConfigurationElement
        {
            [ConfigurationProperty("name", IsRequired = true)]
            public string Name =>
                this["name"] as string;
        }

        internal class AssetsElement : ConfigurationElement
        {
            [ConfigurationProperty("path", DefaultValue = "assets")]
            internal string Path =>
                this["path"] as string;
        }
    }
}
