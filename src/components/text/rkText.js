import React from 'react';

import {
  Text,
  Platform,
  View,
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
  typeMapping = {
    text: {
      color: 'color',
      backgroundColor: 'backgroundColor',
      fontSize: 'fontSize',
      fontFamily: 'fontFamily',
      letterSpacing: 'letterSpacing'
    }
  };

  minSpaceIndex = 1;

  insertLetterSpacing(text, style, letterSpacing = 0) {
    let spaceCount = Math.round(letterSpacing * this.minSpaceIndex);
    // let wordsText = text.split(' ').map((value) => <View><Text>{value.split('').join('\u200A'.repeat(spaceCount))}</Text></View>).join();
    let wordsText = <Text style={style}>{text.split('').join('\u200A'.repeat(spaceCount))}</Text>;
    return (
      <View style={{flexDirection: 'row'}}>
        {text.map((value) =>
          <View>
            <Text>{value.split('').join('\u200A'.repeat(spaceCount))}
            </Text>
          </View>
        )}
      </View>
    );
  }

  extractLetterSpacing(testStyle) {
    let letterSpacing = 0;
    testStyle.forEach((value, index) => {
      if (value.letterSpacing) letterSpacing = (value.letterSpacing)
    });
    return letterSpacing;
  }

  render() {
    let {
      rkType,
      style,
      children,
      ...textProps
    } = this.props;
    let styles = this.defineStyles(rkType);

    let letterSpacing = (style && style.letterSpacing);
    let needToInsertSpaces = Platform.OS === 'android' && letterSpacing;
    let spaceCount = Math.round(letterSpacing * this.minSpaceIndex);
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
        {
          needToInsertSpaces
            ? children.split(' ').map((value, index) =>
              <Text key={index} style={[styles.text, style]} {...textProps}>
                {value.split('').join('\u200A'.repeat(spaceCount))}
                {'\u200A'.repeat(spaceCount)}&nbsp;{'\u200A'.repeat(spaceCount)}
              </Text>
            )
            : <Text style={[styles.text, style]}>{children}</Text>
        }
      </View>
    );
  }
}
