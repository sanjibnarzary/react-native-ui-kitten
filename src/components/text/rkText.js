import React from 'react';

import {
  Text,
  Platform,
  View,
  StyleSheet,
} from 'react-native';

import {RkComponent} from '../rkComponent.js';

/**
 * `RkText` is a component used to render text blocks
 *
 * @extends RkComponent
 *
 * @example Simple usage example:
 *
 * ```
 * <RkText>Text</RkText>
 * ```
 *
 * @example Using rkType prop
 *
 * `RkText` has `rkType` prop. This prop works similar to CSS-class in web. It's possible to set more than one type.
 * There are already some predefined types. Here is example of how to use rkType
 *
 * ```
 * <RkText rkType='primary'>Primary</RkText>
 * <RkText rkType='danger large'>Danger and Large</RkText>
 * ```
 *
 * @example Define new rkTypes
 *
 * It's easy and very common to create new types. Main point for all customization is `RkTheme` object.
 * New rkTypes are defined using `setType` method of `RkTheme`:
 *
 * ```
 * RkTheme.setType('RkText','hero',{
 *  fontSize: 40
 * });
 *
 * //...
 *
 * <RkText rkType='hero'>Header</RkText>
 * ```
 *
 * @styles Available properties
 * - `color` : Color of text
 * - `backgroundColor` : Background color of `RkText`
 * - `fontSize` : Font size of text
 * - `letterSpacing` : specifies the spacing behavior between text characters. React native supports letter spacing only for iOS. For Android you can use our custom letter spacing if you additionally set `useAndroidLetterSpacing` to `true`
 *
 * @example Advanced Styling
 *
 * It's also possible to implement more detailed styling. `RkText` wraps base `Text` component.
 * It's easy to set styles for each component.
 *
 * ```
 * RkTheme.setType('RkText','italic',{
 *   text:{
 *     fontStyle:'italic'
 *   }
 * });
 * ```
 *
 * @styles Available components:
 * - `text` : `Text` - component used to show text.
 *
 * @property {string} rkType - Types for component stylization
 * By default RkText supports following types: `primary`, `info`, `warning`, `danger`, `success`, `xxlarge`, `xlarge`,
 `large`, `small`, `medium`, `header`, `subtitle`
 * @property {Text.props} props - All `Text` props also applied to `RkText`
 */

export class RkText extends RkComponent {
  componentName = 'RkText';
  minSpaceIndex = 1;
  spaceChar = '\u200A';
  wordDiveder = ' ';
  typeMapping = {
    text: {
      color: 'color',
      backgroundColor: 'backgroundColor',
      fontSize: 'fontSize',
      fontFamily: 'fontFamily',
      letterSpacing: 'letterSpacing'
    }
  };
  textProps = [
    'ellipsizeMode', 'numberOfLines',
    'textBreakStrategy', 'onPress',
    'onLongPress', 'pressRetentionOffset',
    'selectable', 'selectionColor',
    'suppressHighlighting', 'allowFontScaling',
    'adjustsFontSizeToFit', 'minimumFontScale',
    'disabled'
  ];
  textStylesProps = [
    'color', 'fontFamily',
    'fontSize', 'fontStyle',
    'fontWeight', 'fontVariant',
    'textShadowOffset', 'textShadowRadius',
    'textShadowColor', 'letterSpacing',
    'lineHeight', 'textAlign',
    'textAlignVertical', 'includeFontPadding',
    'textDecorationLine', 'textDecorationStyle',
    'textDecorationColor', 'writingDirection',
  ];

  clearStyleProperty(key, style, rkStyles) {
    style && delete style[key];
    rkStyles && rkStyles.text && delete rkStyles.text[key];
  }

  extractStyleValue(key, style, rkStyles) {
    return (style && style[key]) || (rkStyles && rkStyles.text && rkStyles.text[key])
  }

  directTextProps(textProps) {
    let complexProps = {wrapProps: {}, textProps: {}};
    for (let key in textProps) {
      this.textProps.includes(key)
        ? complexProps.textProps[key] = textProps[key]
        : complexProps.wrapProps[key] = textProps[key];
    }
    return complexProps;
  }

  directTextStyles(stylesArray) {
    let styleKey, styleValue;
    let complexStyles = {wrapStyles: {}, textStyles: {}};
    stylesArray.forEach((value) => {
      for (let key in value) {
        styleKey = typeof value[key] === 'object' ? Object.keys(value[key])[0] : key;
        styleValue = typeof value[key] === 'object' ? value[key][styleKey] : value[key];
        this.textStylesProps.includes(styleKey)
          ? complexStyles.textStyles[styleKey] = styleValue
          : complexStyles.wrapStyles[styleKey] = styleValue;
      }
    });
    return complexStyles;
  }

  _renderText(children, stylesArray, textProps) {
    return (
      <Text style={stylesArray} {...textProps}>{children}</Text>
    );
  }

  _renderWord(value, spaceCount, textStyles, textProps) {
    return (
      <Text style={textStyles} {...textProps}>
        {value.split('').join(this.spaceChar.repeat(spaceCount))}
        {this.spaceChar.repeat(spaceCount)}{this.wordDiveder}{this.spaceChar.repeat(spaceCount)}
      </Text>
    );
  }

  _renderNestedText(child, textStyles, textProps) {
    return <Text style={textStyles} {...textProps}>{child}</Text>
  }

  _renderTextWithSpacing(children, stylesArray, spaceCount, textProps) {
    let textChildren = typeof children === 'string' ? [children] : children;
    let complexStyles = this.directTextStyles(stylesArray);
    let complexProps = this.directTextProps(textProps);
    return (
      <View style={[styles.textContainer, complexStyles.wrapStyles]} {...complexProps.wrapProps}>
        {
          textChildren.map(
            (child, index) =>
              (typeof child === 'string')
                ? child.split(' ').map(
                  (value) => this._renderWord(value, spaceCount, complexStyles.textStyles, complexProps.textProps)
                )
                : this._renderNestedText(child, complexStyles.textStyles, complexProps.textProps)
          )
        }
      </View>
    );
  }

  render() {
    let {
      rkType,
      style,
      children,
      ...textProps
    } = this.props;
    let rkStyles = this.defineStyles(rkType);
    let letterSpacing = this.extractStyleValue('letterSpacing', style, rkStyles);
    let useAndroidLetterSpacing = this.extractStyleValue('useAndroidLetterSpacing', style, rkStyles);
    let needToInsertSpaces = Platform.OS === 'android' && letterSpacing && useAndroidLetterSpacing;
    if (needToInsertSpaces)
      this.clearStyleProperty('useAndroidLetterSpacing', style, rkStyles);

    let spaceCount = Math.round(letterSpacing * this.minSpaceIndex);
    let textContent = needToInsertSpaces
      ? this._renderTextWithSpacing(children, [rkStyles.text, style], spaceCount, textProps)
      : this._renderText(children, [rkStyles.text, style], textProps);
    return textContent;
  }
}

let styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
});
